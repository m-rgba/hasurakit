<script>
  import { Link } from 'svelte-navigator'
	import { clickOutside } from '@/utilities/clickOutside';

  import Icon from 'svelte-icons-pack/Icon.svelte'
  import BiCodeAlt from 'svelte-icons-pack/bi/BiCodeAlt'
  import BiCog from 'svelte-icons-pack/bi/BiCog'
  import BiData from 'svelte-icons-pack/bi/BiData'
  import BiNetworkChart from 'svelte-icons-pack/bi/BiNetworkChart'
  import BiTime from 'svelte-icons-pack/bi/BiTime'
  import BiMenuAltLeft from 'svelte-icons-pack/bi/BiMenuAltLeft'
  import BiX from 'svelte-icons-pack/bi/BiX'

  export let header;
  export let subheader;

  let uiState = {}
</script>

<!-- Desktop Header -->
<header class="hidden sm:flex items-center px-3 bg-slate-800 dark:bg-slate-900">
  <img src="/images/logo.svg" style="height: 26px;" class="mx-2" alt="Hasura Logo"/>
  <Link to="/api">
    <div class="flex items-center py-2 px-0.5">
      <div class="{header === 'api' ? 
        'cursor-pointer flex items-center py-1 px-3 text-slate-50 bg-slate-700 font-semibold rounded hover:bg-slate-700' :
        'cursor-pointer flex items-center py-1 px-3 text-slate-400 font-semibold rounded hover:text-slate-300 hover:bg-slate-700'
      }">
        <Icon src={BiCodeAlt} size="18" className="{header === 'api' ? 'text-brandTeal' : 'text-slate-400'} fill-current mr-1" title="API" />
        <p>API</p>
      </div>  
    </div>
  </Link>
  <div class="ml-auto flex items-center py-2 px-0.5">
    <div use:clickOutside on:outside={() => (uiState.settingsDrop = false)} class="relative">
      <div on:click={() => (uiState.settingsDrop = true)} class="{header === 'Settings' || uiState.settingsDrop ? 
        'cursor-pointer flex items-center py-1 px-3 text-slate-50 bg-slate-700 font-semibold rounded hover:bg-slate-700' :
        'cursor-pointer flex items-center py-1 px-3 text-slate-400 font-semibold rounded hover:text-slate-300 hover:bg-slate-700'
      }">
        <Icon src={BiCog} size="18" className="{header === 'Settings' ? 'text-brandTeal' : 'text-slate-400'} fill-current mr-1" title="API" />
        <p>Settings</p>
      </div>
      {#if uiState.settingsDrop}
        <div class="absolute p-1 right-0 mt-1.5 rounded shadow text-slate-50 bg-slate-900 dark:bg-slate-600 dark:border dark:border-slate-400 z-50">
          <p class="pt-1 pb-0.5 px-2 whitespace-nowrap text-gray-300 text-sm">Users</p>
          <div class="flex items-center cursor-pointer whitespace-nowrap py-1 px-2 rounded hover:bg-slate-600 dark:hover:bg-slate-900">
            Manage Users
          </div>
          <p class="pt-1 pb-0.5 px-2 whitespace-nowrap text-gray-300 text-sm">Profile</p>
          <div class="flex items-center cursor-pointer whitespace-nowrap py-1 px-2 rounded hover:bg-slate-600 dark:hover:bg-slate-900">
            My Profile
          </div>
          <div class="flex items-center cursor-pointer whitespace-nowrap py-1 px-2 rounded hover:bg-slate-600 dark:hover:bg-slate-900">
            Logout
          </div>
        </div>
      {/if}
    </div>
  </div>  
</header>

<!-- Sub Nav -->
<nav class="hidden sm:flex items-center font-semibold px-3 bg-slate-700 dark:bg-slate-800 border-b border-slate-400 dark:border-slate-600 -mb-px z-30">
  {#if header === 'api'}
    <Link to="/api/graphiql">
      <div class="{subheader === 'graphiql' ? 
        'text-slate-50 border-slate-400 -mb-px flex items-center py-2 px-2 border-b-4' :
        'cursor-pointer text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-400 -mb-px flex items-center py-2 px-2 border-b-4'
      }">
      GraphiQL
      </div>
    </Link>
    <Link to="/api/collections">
      <div class="{subheader === 'collections' ? 
        'text-slate-50 border-slate-400 -mb-px flex items-center py-2 px-2 border-b-4' :
        'cursor-pointer text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-400 -mb-px flex items-center py-2 px-2 border-b-4'
      }">
      Collections
      </div>
    </Link>
  {/if}
</nav>