<script>
  import { get } from 'svelte/store';

  import Icon from 'svelte-icons-pack/Icon.svelte';
  import BiSun from 'svelte-icons-pack/bi/BiSun';
  import BiMoon from 'svelte-icons-pack/bi/BiMoon';

	import { darkMode } from '@/globalStore.js';

  function darkModeInit(){
    const updateDarkMode = !get(darkMode);
    darkMode.set(updateDarkMode)
  }
</script>

<footer class="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 dark:text-slate-50 border-t border-slate-400 dark:border-slate-600">
  <div class="flex items-center h-6 px-3 border-r border-slate-400 dark:border-slate-600">
    <span class="font-mono font-semibold text-xs uppercase tracking-wider flex items-center mr-2"> http://localhost:3000 </span>
    <span class="h-2 w-2 mr-1 bg-green-600"></span>
    <span class="font-mono font-semibold text-slate-400 text-xs uppercase tracking-wider flex items-center">Healthy</span>
  </div>
  <div on:click={darkModeInit} class="cursor-pointer flex items-center h-6 px-3 border-r border-slate-400 dark:border-slate-600">
    {#if $darkMode}
      <Icon size="14" className="fill-current text-white text-purple-300 hover:text-purple-400" src={BiMoon} />
    {:else}
      <Icon size="14" className="fill-current hover:text-amber-600" src={BiSun} />
    {/if}
  </div>
</footer>