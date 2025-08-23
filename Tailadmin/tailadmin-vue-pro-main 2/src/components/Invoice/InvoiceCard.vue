<script setup lang="ts">
import { ref } from 'vue'
import productImage from '@/assets/images/product/product-thumb.png'

const invoiceList = ref([
  {
    image: productImage,
    name: 'Mist Black Triblend',
    link: '#',
    color: 'White',
    size: 'Medium',
    quantity: 1,
    price: 120
  }
])
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-9"
  >
    <div class="flex flex-col-reverse gap-5 xl:flex-row xl:justify-between">
      <div class="flex flex-col gap-4 sm:flex-row xl:gap-9">
        <div>
          <p class="mb-1.5 text-lg font-medium text-black dark:text-white">From</p>
          <h4 class="mb-4 text-2xl font-medium text-black dark:text-white">Roger Culhane</h4>
          <a href="#" class="block"><span class="font-medium">Email:</span> contact@example.com</a>
          <span class="mt-2 block"
            ><span class="font-medium">Address:</span> 2972 Westheimer Rd. Santa Ana.</span
          >
        </div>
        <div>
          <p class="mb-1.5 text-lg font-medium text-black dark:text-white">To</p>
          <h4 class="mb-4 text-2xl font-medium text-black dark:text-white">Cristofer Levin</h4>
          <a href="#" class="block"><span class="font-medium">Email:</span> contact@example.com</a>
          <span class="mt-2 block"
            ><span class="font-medium">Address:</span> New York, USA 2707 Davis Anenue
          </span>
        </div>
      </div>
      <h3 class="text-2xl font-medium text-black dark:text-white">Order #15478</h3>
    </div>

    <div class="my-10 rounded-sm border border-stroke p-5 dark:border-strokedark">
      <template v-for="(product, productIndex) in invoiceList" :key="productIndex">
        <div class="items-center sm:flex">
          <div class="mb-3 mr-6 h-20 w-20 sm:mb-0">
            <img
              :src="product.image"
              alt="product"
              class="h-full w-full rounded-sm object-cover object-center"
            />
          </div>
          <div class="w-full items-center justify-between md:flex">
            <div class="mb-3 md:mb-0">
              <router-link
                :to="product.link"
                class="inline-block font-medium text-black hover:text-primary dark:text-white"
              >
                {{ product.name }}
              </router-link>
              <p class="flex text-sm font-medium">
                <span class="mr-5"> Color: {{ product.color }} </span>
                <span class="mr-5"> Size: {{ product.size }} </span>
              </p>
            </div>
            <div class="flex items-center md:justify-end">
              <p class="mr-20 font-medium text-black dark:text-white">
                Qty: {{ product.quantity }}
              </p>
              <p class="mr-5 font-medium text-black dark:text-white">${{ product.price }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="-mx-4 flex flex-wrap">
      <div class="w-full px-4 sm:w-1/2 xl:w-3/12">
        <div class="mb-10">
          <h4 class="mb-4 text-xl font-medium text-black dark:text-white md:text-2xl">
            Shipping Method
          </h4>
          <p class="font-medium">
            FedEx - Take up to 3 <br />
            working days.
          </p>
        </div>
      </div>
      <div class="w-full px-4 sm:w-1/2 xl:w-3/12">
        <div class="mb-10">
          <h4 class="mb-4 text-xl font-medium text-black dark:text-white md:text-2xl">
            Payment Method
          </h4>
          <p class="font-medium">
            Apply Pay Mastercard <br />
            **** **** **** 5874
          </p>
        </div>
      </div>
      <div class="w-full px-4 xl:w-6/12">
        <div class="mr-10 text-right md:ml-auto">
          <div class="ml-auto sm:w-1/2">
            <p class="mb-4 flex justify-between font-medium text-black dark:text-white">
              <span> Subtotal </span>
              <span> $120.00 </span>
            </p>
            <p class="mb-4 flex justify-between font-medium text-black dark:text-white">
              <span> Shipping Cost (+) </span>
              <span> $10.00 </span>
            </p>
            <p
              class="mb-4 mt-2 flex justify-between border-t border-stroke pt-6 font-medium text-black dark:border-strokedark dark:text-white"
            >
              <span> Total Payable </span>
              <span> $130.00 </span>
            </p>
          </div>

          <div class="mt-10 flex flex-col justify-end gap-4 sm:flex-row">
            <button
              class="flex items-center justify-center rounded border border-primary py-2.5 px-8 text-center font-medium text-primary hover:opacity-90"
            >
              Download Invoice
            </button>
            <button
              class="flex items-center justify-center rounded bg-primary py-2.5 px-8 text-center font-medium text-gray hover:bg-opacity-90"
            >
              Send Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
