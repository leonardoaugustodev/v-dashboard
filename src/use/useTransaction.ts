import {
  writeBatch,
  setDoc,
  doc,
  runTransaction,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import moment from 'moment';
import { db } from '../database/firebase';
import { ITransaction } from '../schemas/transaction';
import { useUserStore } from '../store/user';
import { generateId } from '../utils/hash';
import { updateAccountBalance } from './useAccount';

const TABLE_NAME = 'transactions';

export const upsert = async (
  transactions: Array<ITransaction>,
  oldAmounts?: Array<{
    _id: string;
    amount: number;
  }>
) => {
  try {
    let amountToUpdate = 0;
    const toUpdate = [];
    const toInsert = [];

    for (let transaction of transactions) {
      const momentDate = moment(transaction.date);
      transaction = {
        ...transaction,
        day: momentDate.date(),
        month: momentDate.month(),
        year: momentDate.year(),
      };

      Object.keys(transaction).forEach(
        (key) =>
          transaction[key as keyof ITransaction] === undefined &&
          delete transaction[key as keyof ITransaction]
      );

      if (transaction._id) {
        if (oldAmounts) {
          const oldAmount = oldAmounts.find((x) => x._id === transaction._id);
          if (oldAmount) {
            amountToUpdate +=
              transaction.inflow - transaction.outflow - oldAmount.amount;
          }
        }
        toUpdate.push(transaction);
      } else {
        amountToUpdate += transaction.inflow - transaction.outflow;
        toInsert.push(transaction);
      }
    }

    if (toUpdate.length) {
      await update(toUpdate);
    }

    if (toInsert.length) {
      await insert(toInsert);
    }

    if (amountToUpdate != 0 && transactions[0].accountId) {
      updateAccountBalance(transactions[0].accountId, amountToUpdate);
    }
  } catch (e) {
    console.error('Error upserting documents: ', e);
  }
};

export const insert = async (transactions: Array<ITransaction>) => {
  try {
    const batch = writeBatch(db);

    for (const transaction of transactions) {
      const newTransaction = {
        _id: await generateId('transaction', JSON.stringify(transaction)),
        userId: useUserStore().user.uid,
        ...transaction,
      };

      await batch.set(doc(db, TABLE_NAME, newTransaction._id), newTransaction);
    }

    await batch.commit();
  } catch (e) {
    console.error('Error inserting document: ', e);
  }
};

export const update = async (transactions: Array<ITransaction>) => {
  try {
    const batch = writeBatch(db);

    for (const transaction of transactions) {
      batch.update(doc(db, TABLE_NAME, transaction._id), { ...transaction });
    }

    await batch.commit();
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const deleteRecords = async (transactions: Array<ITransaction>) => {
  try {
    const batch = writeBatch(db);

    let balanceToRemove = 0;

    for (const transaction of transactions) {
      batch.delete(doc(db, TABLE_NAME, transaction._id));
      balanceToRemove += -(transaction.inflow - transaction.outflow);
    }

    await batch.commit();

    if (transactions.length && transactions[0].accountId) {
      updateAccountBalance(transactions[0].accountId, balanceToRemove);
    }
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};
