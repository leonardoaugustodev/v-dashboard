<template>
  <div class="panel cursor-pointer hover:brightness-110" @click="handleNavigate">
    <div class="card shadow-lg">
      <div class="card__name">{{ account.name }}</div>
      <div class="card__subname">{{ account.type }}</div>
      <div class="card__balance" >{{ formatCurrency(account.balance) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../store/user';
import { formatCurrency } from '../utils/currency';
import { useRoute, useRouter } from 'vue-router';

const { account } = defineProps(['account'])

const userStore = useUserStore();
const router = useRouter();

const handleNavigate = () => {
  router.push({
    name: 'AccountDetail', params: { id: account._id }
  })
}
</script>

<style lang="scss" scoped>
// --- panel ------------------------------------------------------------------

.panel {
  width: 100%;
  margin: 0 auto;
  // text-align: center;
}

// --- CARD -------------------------------------------------------------------

.card {
  position: relative;
  vertical-align: middle;
  display: flex;
  flex-direction: column;
  justify-content: center;

  height: 120px;
  padding: 30px;
  color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
  background: hsl(217, 100%, 52%);
  // background: linear-gradient(315deg, hsl(217, 86%, 50%) 0%, hsl(217, 86%, 55%) 50%, hsl(217, 86%, 60%) 100%);
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' %3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='0' y1='0' y2='1' gradientTransform='rotate(0,0.5,0.5)'%3E%3Cstop offset='0' stop-color='%2380F'/%3E%3Cstop offset='1' stop-color='%2300B7FF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpattern id='b' width='7' height='7' patternUnits='userSpaceOnUse'%3E%3Ccircle fill='%23ffffff' cx='3.5' cy='3.5' r='3.5'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='url(%23a)'/%3E%3Crect width='100%25' height='100%25' fill='url(%23b)' fill-opacity='0.1'/%3E%3C/svg%3E");
  background-attachment: fixed;

  &__name {
    font-size: 18px;
    font-weight: 700;
  }

  &__subname {
    font-size: 12px;
    opacity: 75%;
  }

  &__balance {
    font-size: 30px;
    font-weight: 700;
  }


}
</style>
