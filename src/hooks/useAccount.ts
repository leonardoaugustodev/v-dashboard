import { ref } from 'vue';
import { IAccount } from '../schemas/account';


export function useAccount() {
  const defaultAccount = <IAccount>{
    name: '',
    type: '',
    on_budget: true,
    status: 'active',
    balance: 0,
  };

  const accountTableData = ref<Array<IAccount>>(
    [...Array(10).keys()].map((element, index) => ({
      id: `${index}`,
      name: `Account ${index}`,
      type: 'Checking',
      on_budget: true,
      status: 'Open',
      balance: Math.random() * 100000
    }))
  );


  return { defaultAccount, accountTableData };
}
