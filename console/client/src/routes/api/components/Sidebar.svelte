<script>
  import { Link } from 'svelte-navigator'

  import Icon from 'svelte-icons-pack/Icon.svelte';
  import BiSearch from 'svelte-icons-pack/bi/BiSearch';
  import BiSidebar from 'svelte-icons-pack/bi/BiSidebar';
  import BiArrowToLeft from 'svelte-icons-pack/bi/BiArrowToLeft';
  import BiFolder from 'svelte-icons-pack/bi/BiFolder';
  import BiFolderOpen from 'svelte-icons-pack/bi/BiFolderOpen';
  import BiTable from 'svelte-icons-pack/bi/BiTable';
  import BiCog from 'svelte-icons-pack/bi/BiCog';
  import BiData from 'svelte-icons-pack/bi/BiData';
  import BiRightArrowAlt from 'svelte-icons-pack/bi/BiRightArrowAlt';
  import BiFileBlank from 'svelte-icons-pack/bi/BiFileBlank';

  export let activeCollection;
  export let activePage;
</script>

<!-- Sidebar -->
<div id="sidebar" class="fixed w-full h-full relative block bg-white dark:bg-slate-900 overflow-auto split content z-10">
  <div class="sticky top-0 pt-3 px-3 mb-3 bg-white dark:bg-slate-900">
    <div class="flex items-center mb-2">
      <h4 class="font-semibold mb-0">Collections</h4>
      <button class="flex items-center btn-default ml-auto text-sm h-6">
        <Icon size="13" className="fill-current mr-1" src={BiCog} />
        Manage
      </button>
    </div>
    <div class="relative">
      <Icon size="14" className="left-2 top-2 absolute text-slate-600 dark:text-slate-400 fill-current mr-1" src={BiSearch} />
      <input type="text" class="input-base pl-7" placeholder="Search Collections..." />
    </div>
  </div>

  <div class="px-3 mb-4">
    <div class="cursor-pointer flex items-center px-2 h-8 mb-0.5 w-full min-w-min whitespace-nowrap font-semibold rounded hover:bg-slate-100 dark:hover:bg-slate-600">
      <Icon size="14" className="text-brandBlue-400 fill-current mr-1" src={BiFolderOpen} /> collection
    </div>  
    <div class="px-3 ml-4 border-l border-slate-400">  
      <div class="cursor-pointer flex items-center px-2 h-8 mb-0.5 w-full min-w-min whitespace-nowrap rounded hover:bg-slate-100 dark:hover:bg-slate-600">
        <Icon size="14" className="text-slate-600 dark:text-slate-400 fill-current mr-1" src={BiFileBlank} /> query_1
      </div> 
      <div class="cursor-pointer flex items-center px-2 h-8 mb-0.5 w-full min-w-min whitespace-nowrap rounded hover:bg-slate-100 dark:hover:bg-slate-600">
        <Icon size="14" className="text-slate-600 dark:text-slate-400 fill-current mr-1" src={BiFileBlank} /> query_2
      </div>        
    </div>
    <div class="cursor-pointer flex items-center px-2 h-8 mb-0.5 w-full min-w-min whitespace-nowrap rounded hover:bg-slate-100 dark:hover:bg-slate-600">
      <Icon size="14" className="text-slate-600 dark:text-slate-400 fill-current mr-1" src={BiFolder} /> collecton_2
    </div>  
  </div>

</div>