<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import DataStatsFive from '@/components/DataStats/DataStatsFive.vue'
import ChartTwelve from '@/components/Charts/ChartTwelve.vue'
import MyStocks from '@/components/Stocks/MyStocks.vue'
import TrendingStocks from '@/components/Stocks/TrendingStocks.vue'
import LatestTransaction from '@/components/Stocks/LatestTransaction.vue'
</script>

<template>
  <DefaultLayout>
    <div class="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-9">
      <!-- ===== Data Stats Start ===== -->
      <DataStatsFive />
      <!-- ===== Data Stats End ===== -->

      <!-- ====== Chart Twelve Start -->
      <ChartTwelve />
      <!-- ====== Chart Twelve End -->

      <!-- ====== My Stocks Card Start -->
      <MyStocks />
      <!-- ====== My Stocks Card End -->

      <!-- ====== Trending Stocks Card Start -->
      <TrendingStocks />
      <!-- ====== Trending Stocks Card End -->

      <!-- ====== Latest Transaction Card Start -->
      <LatestTransaction />
      <!-- ====== Latest Transaction Card End -->
    </div>
  </DefaultLayout>
</template>
