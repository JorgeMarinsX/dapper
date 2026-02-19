<template>
  <div class="min-h-screen bg-elevated/50">
    <header class="border-b border-default bg-default">
      <div class="mx-auto max-w-2xl flex items-center justify-between px-4 py-3">
        <span class="text-lg font-bold tracking-tight text-primary">Dapper</span>
      </div>
    </header>
    <main class="mx-auto max-w-2xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>
