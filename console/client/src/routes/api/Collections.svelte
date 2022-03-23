<script>
  import { onMount } from 'svelte';
	import { clickOutside } from '@/utilities/clickOutside';

  import Split from 'split.js';
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import BiCog from 'svelte-icons-pack/bi/BiCog';
  import BiData from 'svelte-icons-pack/bi/BiData';
  import BiTable from 'svelte-icons-pack/bi/BiTable';
  import BiCopy from 'svelte-icons-pack/bi/BiCopy';
  import BiSearch from 'svelte-icons-pack/bi/BiSearch';
  import BiTrashAlt from 'svelte-icons-pack/bi/BiTrashAlt';
  import BiEditAlt from 'svelte-icons-pack/bi/BiEditAlt';
  import BiFolder from 'svelte-icons-pack/bi/BiFolder';
  import BiCheckCircle from 'svelte-icons-pack/bi/BiCheckCircle';
  import BiMinusCircle from 'svelte-icons-pack/bi/BiMinusCircle';
  import BiCaretDown from 'svelte-icons-pack/bi/BiCaretDown';
  import BiLinkAlt from 'svelte-icons-pack/bi/BiLinkAlt';
  import BiPlus from 'svelte-icons-pack/bi/BiPlus';
  import BiMinus from 'svelte-icons-pack/bi/BiMinus';
  import AiOutlineFunction from 'svelte-icons-pack/ai/AiOutlineFunction';

  import Header from '@/components/Header.svelte'
  import Footer from '@/components/Footer.svelte'
  import Sidebar from './components/Sidebar.svelte'

	import { darkMode } from '@/globalStore.js';

  let uiState = {};

  function modalInit(){
    uiState.modalState = !uiState.modalState
    if ( uiState.modalState === true ){
      document.body.classList.add('overflow-y-hidden')
    } else {
      document.body.classList.remove('overflow-y-hidden')
    }
  }

  onMount(async () => {
    if ( window.innerWidth <= 640 === false ){
      hSplit = Split(['#sidebar', '#content'], {
        sizes: [20, 80],
        gutterSize: 3,
        cursor: 'col-resize',
      });
    }
  });

  $ : {
    // Debug uiState
    console.log(uiState)
  }
</script>

<main class="{$darkMode ? 'dark':''} flex flex-col h-screen text-slate-900 antialiased">  
  {#if uiState.modalState === true}
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-4/12 rounded overflow-hidden shadow" style="z-index:90;" id="modal-sample">
      <div class="flex flex-col" style="max-height:calc(100vh - 40px);">
        <div class="px-3 py-2 border-0 border-b border-slate-300 dark:border-0 dark:bg-slate-900 z-10">
          <p class="font-semibold dark:text-slate-50">This is a modal header</p>
          <p class="text-slate-600 dark:text-slate-400">This is a subheader which follows a modal</p>
        </div>
        <div class="flex flex-grow p-3 bg-slate-50 overflow-auto dark:bg-slate-800">
          <p class="dark:text-slate-50" style="height:2400px;">This is the modal's body area... it can be very long</p>
        </div>
        <div class="px-3 py-2 border-0 border-t border-slate-300 dark:border-0 dark:bg-slate-900 z-10">
          <div class="flex items-center">
            <p class="font-semibold dark:text-slate-50">This is the modal's footer</p>
            <button on:click={modalInit} class="ml-auto btn-default">Close Modal</button>
          </div>
        </div>  
      </div>
    </div>
    <div on:click={modalInit} class="cursor-pointer fixed top-0 w-full h-full bg-slate-900 dark:bg-slate-600 opacity-80" style="z-index:80;" id="modal-backdrop"></div>
  {/if}

  <Header header="api" subheader="collections" />

  <div class="{$darkMode ? 'bg-grid-dark':'bg-grid'} flex flex-grow overflow-hidden dark:text-slate-50">
    <Sidebar activePage="schema" />

    <!-- Body Content -->
    <div id="content">
      
      <div id="top" class="flex flex-col h-full split content">
        <div id="header" class="relative flex items-start px-3 py-3 shadow bg-white dark:bg-slate-900 z-20">
          <div>
            <h2 class="cursor-pointer group flex items-center text-xl font-semibold px-2 py-0.5 w-max rounded hover:bg-slate-100 dark:hover:bg-slate-700">
              <Icon size="14" className="fill-current mr-1" src={BiFolder} />
              query collection name
              <Icon size="14" className="opacity-0 group-hover:opacity-100 text-slate-400 fill-current ml-1" src={BiEditAlt} />
            </h2>
            <h3 class="flex items-center cursor-pointer group text-slate-600 dark:text-slate-400 px-2 py-0.5 w-max rounded hover:bg-slate-100 dark:hover:bg-slate-700">
              query collection comment
              <Icon size="14" className="opacity-0 group-hover:opacity-100 text-slate-400 fill-current ml-1" src={BiEditAlt} />
            </h3>  
          </div>
          <div class="flex items-center ml-auto">
            <button class="btn-default text-red-700 dark:text-red-500 mr-0">
              <Icon size="14" className="fill-current mr-1" src={BiTrashAlt} />
              Delete Collection
            </button>
          </div>
        </div>

        <div class="flex-grow px-10 py-10 overflow-y-auto">

          <div>
            If the Allow List is enabled on your instance, only queries found in the Allow List (or Collections added to your Allow List) will be allowed.<br />
            Admin users will always be able to access queries, regardless of Allow List.
          </div>

          <div class="bg-white mx-auto border border-slate-300 rounded shadow overflow-hidden dark:shadow-lg dark:border-0">
            <div class="flex items-end px-3 py-2 border-0 border-b border-slate-300 dark:border-0 dark:bg-slate-900">
              <div class="mr-1">
                <p class="font-semibold">Collection Queries</p>
                <p class="text-slate-600 text-sm dark:text-slate-400">These are the queries which are found in your Collection.</p>    
              </div>
              <div class="ml-auto flex items-center">
                <div use:clickOutside on:outside={() => (uiState.addObjectDropState = false)} class="relative mr-2">
                  <button on:click={() => (uiState.addObjectDropState = true)} class="btn-default">
                    <Icon size="14" className="fill-current mr-1" src={BiPlus} />
                    Add Object
                  </button>
                  {#if uiState.addObjectDropState}
                    <div class="absolute p-1 left-0 mt-1.5 rounded shadow text-slate-50 bg-slate-900 dark:bg-slate-600 dark:border dark:border-slate-400"> 
                      <p class="pt-1 pb-0.5 px-2 whitespace-nowrap text-gray-300 text-sm">Using Builder</p>
                      <div on:click={() => (uiState.addObjectDropState = false)} class="flex items-center cursor-pointer whitespace-nowrap py-1 px-2 rounded hover:bg-slate-600 dark:hover:bg-slate-900">
                        <Icon size="13" className="fill-current mr-1" src={BiTable} />
                        Table
                      </div>
                      <div on:click={() => (uiState.addObjectDropState = false)} class="flex items-center cursor-pointer whitespace-nowrap py-1 px-2 rounded hover:bg-slate-600 dark:hover:bg-slate-900">
                        <Icon size="13" className="fill-current mr-1" src={BiLinkAlt} />
                        Enum Table
                      </div>
                      <hr class="border-0 border-t border-slate-400 my-1" />
                      <p class="pt-1 pb-0.5 whitespace-nowrap px-2 text-gray-300 text-sm">Using SQL Editor</p>
                      <div on:click={() => (uiState.addObjectDropState = false)} class="flex items-center cursor-pointer whitespace-nowrap py-1 px-2 rounded hover:bg-slate-600 dark:hover:bg-slate-900">
                        <Icon size="13" className="fill-current mr-1" src={BiCopy} />
                        View
                      </div>
                      <div on:click={() => (uiState.addObjectDropState = false)} class="flex items-center cursor-pointer whitespace-nowrap py-1 px-2 rounded hover:bg-slate-600 dark:hover:bg-slate-900">
                        <Icon size="13" className="fill-current mr-1" src={AiOutlineFunction} />
                        Function
                      </div>
                    </div>
                  {/if}
                </div>    
                <div class="relative">
                  <Icon size="14" className="left-2 top-2 absolute text-slate-600 dark:text-slate-400 fill-current mr-1" src={BiSearch} />
                  <input type="text" class="input-base pl-7 w-52" placeholder="Search Objects..." />
                </div>            
              </div>
            </div>
            <div class="bg-slate-50 dark:bg-slate-800 overflow-x-auto">
              <table class="min-w-full text-left">
                <thead class="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-gray-300">
                  <th class="font-semibold text-center px-2 pl-4 py-2 whitespace-nowrap">
                    <input id="selector" name="selector" type="checkbox" class="focus:ring-brandBlue-400 dark:focus:ring-offset-black cursor-pointer h-5 w-5 text-brandBlue-400 border-gray-400 rounded">
                  </th>
                  <th class="font-semibold p-2 whitespace-nowrap">Name</th>
                  <th class="font-semibold p-2 whitespace-nowrap">Query Preview</th>
                  <th class="font-semibold p-2 whitespace-nowrap"></th>
                </thead>
                <tbody class="text-left bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-600">
                  <tr class="group-1">
                    <td class="text-center px-2 pl-4 py-3 whitespace-nowrap">
                      <input id="selector" name="selector" type="checkbox" class="focus:ring-brandBlue-400 dark:focus:ring-offset-black cursor-pointer h-5 w-5 text-brandBlue-400 border-gray-400 rounded">
                    </td>
                    <td class="px-2 py-3 whitespace-nowrap text-brandBlue-500 dark:text-brandBlue-200 dark:hover:text-brandBlue-400 hover:text-brandBlue-700">
                      customer
                    </td>
                    <td class="px-2 py-3 whitespace-nowrap">
                      this is an optional description of the table pulled from SQL
                    </td>
                    <td class="px-2 py-3 whitespace-nowrap">
                      <div class="opacity-0 group-1-hover:opacity-100 flex items-center">
                        <button class="flex items-center text-brandBlue-500 dark:text-brandBlue-200 dark:hover:text-brandBlue-400 hover:text-brandBlue-700 mr-2">
                          <Icon size="14" className="fill-current mr-1" src={BiEditAlt} />
                          Edit
                        </button>
                        <button class="flex items-center text-red-600 hover:text-red-800">
                          <Icon size="14" className="fill-current mr-1" src={BiTrashAlt} />
                          Delete
                        </button>  
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
  <Footer />
</main>