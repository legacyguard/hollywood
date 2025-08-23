<template>
  <section class="overflow-hidden px-4 sm:px-8">
    <div class="flex h-screen flex-col items-center justify-center overflow-hidden">
      <div class="no-scrollbar overflow-y-auto py-20">
        <div class="mx-auto w-full max-w-[480px]">
          <div class="text-center">
            <router-link to="/" class="mx-auto mb-10 inline-flex">
              <img src="@/assets/images/logo/logo-dark.svg" alt="logo" class="dark:hidden" />
              <img src="@/assets/images/logo/logo.svg" alt="logo" class="hidden dark:block" />
            </router-link>

            <div class="rounded-xl bg-white p-4 shadow-14 dark:bg-boxdark lg:p-7.5 xl:p-12.5">
              <h1 class="mb-2.5 text-3xl font-black leading-[48px] text-black dark:text-white">
                Verify Your Account
              </h1>

              <p class="mb-7.5 font-medium">
                Enter the 4 digit code sent to the registered email id.
              </p>

              <form>
                <div class="flex items-center gap-4.5">
                  <template v-for="index in 4" :key="index">
                    <input
                      type="text"
                      class="w-full rounded-md border-[1.5px] border-stroke bg-transparent p-3 text-center font-medium text-2xl text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </template>
                </div>

                <p class="mb-5 mt-4 text-left font-medium text-black dark:text-white">
                  Did not receive a code?
                  <button class="text-primary">Resend</button>
                </p>

                <button
                  class="flex w-full justify-center rounded-md bg-primary p-[13px] font-bold text-gray hover:bg-opacity-90"
                >
                  Verify
                </button>

                <span class="mt-5 block text-red">
                  Don’t share the verification code with anyone!
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
