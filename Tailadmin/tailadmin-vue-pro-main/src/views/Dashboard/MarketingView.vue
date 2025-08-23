<script setup lang="ts">
import ChartFive from '@/components/Charts/ChartFive.vue'
import ChartSix from '@/components/Charts/ChartSix.vue'
import DataStatsThree from '@/components/DataStats/DataStatsThree.vue'
import ExternalLinks from '@/components/ExternalLinks.vue'
import FeaturedCampaigns from '@/components/FeaturedCampaigns.vue'
import FeedbackCard from '@/components/FeedbackCard.vue'
import TableFour from '@/components/Tables/TableFour.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <!-- ===== Data Stats Start ===== -->
    <DataStatsThree />
    <!-- ===== Data Stats End ===== -->

    <div class="mt-7.5 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
      <!-- ====== Table Four Start -->
      <TableFour />
      <!-- ====== Table Four End -->

      <!-- ===== Chart Five Start ===== -->
      <ChartFive />
      <!-- ===== Chart Five End ===== -->

      <!-- ===== External Links Start ===== -->
      <ExternalLinks />
      <!-- ===== External Links End ===== -->

      <!-- ===== Chart Six Start ===== -->
      <div class="col-span-12 xl:col-span-7">
        <ChartSix />
      </div>
      <!-- ===== Chart Six End ===== -->

      <!-- ===== Featured Campaigns Start ===== -->
      <FeaturedCampaigns />
      <!-- ===== Featured Campaigns End ===== -->

      <!-- ===== Feedback Start ===== -->
      <FeedbackCard />
      <!-- ===== Feedback End ===== -->
    </div>
  </DefaultLayout>
</template>
