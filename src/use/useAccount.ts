import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../database/firebase';
import { useAccountStore } from '../store/account';

export const updateAccountBalance = async (
  accountId: string,
  amountToAdd: number
) => {
  const accRef = doc(db, 'accounts', accountId);
  await runTransaction(db, async (snap) => {
    const sfDoc = await snap.get(accRef);

    if (!sfDoc.exists()) {
      throw 'Document does not exist!';
    }

    const newBalance = sfDoc.data().balance + amountToAdd;
    snap.update(accRef, { balance: newBalance });

    const storedAccount = useAccountStore().getAccount(accountId);
    if(storedAccount) storedAccount.balance = newBalance;
  });
};
