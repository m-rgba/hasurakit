<svelte:head>
	<meta name="robots" content="noindex nofollow" />
	<html lang="en" />
	<title>Hasura Watchtower - GraphiQL</title>
</svelte:head>

<script>
  import { onMount } from 'svelte';
	import { clickOutside } from '@/utilities/clickOutside';

  import { getIntrospectionQuery, printSchema, buildClientSchema, graphql } from 'graphql';

  import 'codemirror/mode/javascript/javascript'
	import CodeMirror from '@joshnuss/svelte-codemirror'
  
  import ReactAdapter from "@/utilities/ReactAdapter.svelte";
  import TykGraphiQL from '@tyk-technologies/graphiql';

  import Icon from 'svelte-icons-pack/Icon.svelte';
  import BiCog from 'svelte-icons-pack/bi/BiCog';
  import BiData from 'svelte-icons-pack/bi/BiData';
  import BiPlus from 'svelte-icons-pack/bi/BiPlus';
  import BiEditAlt from 'svelte-icons-pack/bi/BiEditAlt';
  import IoFlask from 'svelte-icons-pack/io/IoFlask';

  import Header from '@/components/Header.svelte'
  import Footer from '@/components/Footer.svelte'

	import { darkMode } from '@/globalStore.js';

  let uiState = {};

let query = `query passport_lookup {
  _onetoone_owner {
    id
    name
    passport_info {
      passport_number
      id
    }
  }
}`
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': 'myadminsecret'
  }

  let explorerOpen = true
  let activeQuery = 'test';
  let graphqlSchema = getSchema();
  let selectedRole = 'admin'

  let headerValue = { Accept: 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ••••••••••••' }
  headerValue['x-hasura-admin'] = selectedRole
  let headerValParsed = JSON.stringify(headerValue, null, 2)
  let headerEditor
  let headerOpts = {
    mode: {
      name: "javascript",
      json: true,
      statementIndent: 2
    },
		lineNumbers: true
  }

  function editQuery(query){
    console.log('emitted event!')
    console.log(query)
  }

  function modalInit(){
    modalState = !modalState
    if ( modalState === true ){
      document.body.classList.add('overflow-y-hidden')
    } else {
      document.body.classList.remove('overflow-y-hidden')
    }
  }
  
  async function getSchema(){
    return fetcher({
      query: getIntrospectionQuery(),
    }).then((result) => {
      if (result && result.error) {
        return;
      }
      graphqlSchema = printSchema(buildClientSchema(result.data));
      return graphqlSchema
    });
  };

  async function fetcher(graphQLParams){
    const data = await fetch('http://localhost:8080/v1/graphql', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(graphQLParams),
      credentials: 'same-origin',
    });
    return data.json().catch(() => data.text());
  };

  onMount(async () => {
    getSchema();
  });

  $: {
    if (selectedRole){
      headerValue['x-hasura-admin'] = selectedRole;
      headerValParsed = JSON.stringify(headerValue, null, 2);
    }
    if (graphqlSchema){ }
  }
</script>

<main class="{$darkMode ? 'dark':''} flex flex-col h-screen pt-16 sm:pt-0 text-slate-900 antialiased">  
  {#if uiState.modalAnalyze === true}
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-11/12 sm:w-6/12 rounded overflow-hidden shadow" style="z-index:90;" id="modal-sample">
      <div class="flex flex-col" style="max-height:calc(100vh - 40px);">
        <div class="px-3 py-2 border-0 border-b border-slate-300 dark:border-0 dark:bg-slate-900 z-10">
          <p class="font-semibold text-xl sm:text-base dark:text-slate-50">Modify Headers</p>
          <p class="text-slate-600 text-lg sm:text-sm dark:text-slate-400">Set the headers which are sent along with your GraphQL request.</p>
          <p class="text-slate-600 text-lg sm:text-sm dark:text-slate-400">As an administrator, you're able to set <span class="font-mono px-1 py-0.5 whitespace-nowrap rounded bg-slate-100 mx-1">x-hasura...</span> headers like <span class="font-mono px-1 py-0.5 whitespace-nowrap rounded bg-slate-100 mx-1">x-hasura-role</span> and <span class="font-mono px-1 py-0.5 rounded bg-slate-100 mx-1">x-hasura-user</span> to emulate the effects of a JWT token's permissions.</p>
        </div>
        <div class="flex flex-grow bg-slate-50 overflow-auto dark:bg-slate-800">
        </div>
        <div class="px-3 py-2 border-0 border-t border-slate-300 dark:border-0 dark:bg-slate-900 z-10">
          <div class="flex items-center">
            <button class="btn-default">Reset Headers</button>
            <button on:click={() => (uiState.modalActive = false, uiState.modalHeaders = false)} class="sm:ml-auto btn-primary">Save Header</button>
          </div>
        </div>  
      </div>
    </div>
  {/if}
  {#if uiState.modalHeaders === true}
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-11/12 sm:w-6/12 rounded overflow-hidden shadow" style="z-index:90;" id="modal-sample">
      <div class="flex flex-col" style="max-height:calc(100vh - 40px);">
        <div class="px-3 py-2 border-0 border-b border-slate-300 dark:border-0 dark:bg-slate-900 z-10">
          <p class="font-semibold text-xl sm:text-base dark:text-slate-50">Modify Headers</p>
          <p class="text-slate-600 text-lg sm:text-sm dark:text-slate-400">Set the headers which are sent along with your GraphQL request.</p>
          <p class="text-slate-600 text-lg sm:text-sm dark:text-slate-400">As an administrator, you're able to set <span class="font-mono px-1 py-0.5 whitespace-nowrap rounded bg-slate-100 mx-1">x-hasura...</span> headers like <span class="font-mono px-1 py-0.5 whitespace-nowrap rounded bg-slate-100 mx-1">x-hasura-role</span> and <span class="font-mono px-1 py-0.5 rounded bg-slate-100 mx-1">x-hasura-user</span> to emulate the effects of a JWT token's permissions.</p>
        </div>
        <div class="flex flex-grow bg-slate-50 overflow-auto dark:bg-slate-800">
          <CodeMirror bind:headerEditor options={headerOpts} class="w-full h-80" bind:value={headerValParsed}/>
        </div>
        <div class="px-3 py-2 border-0 border-t border-slate-300 dark:border-0 dark:bg-slate-900 z-10">
          <div class="flex items-center">
            <button class="btn-default">Reset Headers</button>
            <button on:click={() => (uiState.modalActive = false, uiState.modalHeaders = false)} class="sm:ml-auto btn-primary">Save Header</button>
          </div>
        </div>  
      </div>
    </div>
  {/if}
  {#if uiState.modalActive === true}
    <div on:click={() => (uiState.modalActive = false, uiState.modalHeaders = false, uiState.modalAnalyze = false)} class="cursor-pointer fixed top-0 w-full h-full bg-slate-900 dark:bg-slate-600 opacity-80" style="z-index:80;" id="modal-backdrop"></div>
  {/if}
  
  <Header header="api" subheader="graphiql" />

  <div id="pageHead" class="relative block sm:flex sm:items-center px-3 py-2 shadow bg-white dark:bg-slate-900 z-20">
    <span class="font-semibold dark:text-slate-50 whitespace-nowrap mr-1">Header</span>
    <div 
      on:click={() => (uiState.modalActive = true, uiState.modalHeaders = true)}
      class="flex items-center cursor-pointer text-xl sm:text-sm text-slate-600 dark:text-slate-400 px-2 py-1 mr-3 w-max rounded hover:bg-slate-100 dark:hover:bg-slate-700">
      <span class="font-mono mr-1 line-clamp-1">{headerValParsed}</span>
      <Icon size="14" className="text-slate-400 fill-current ml-1" src={BiEditAlt} />
    </div>
    <span class="font-semibold dark:text-slate-50 whitespace-nowrap ml-auto mr-2">Use Role:</span>
    <select bind:value={selectedRole} class="input-base dark:text-slate-50 w-max pr-9">
      <option>admin</option>
      <option>user</option>
      <option>manager</option>
      <option>anonymous</option>
    </select>
  </div>

  <div class="{$darkMode ? 'bg-grid-dark':'bg-grid'} flex-grow p-3 overflow-none">
    {#await graphqlSchema}
      <span>Loading...</span>
    {:then}
      <ReactAdapter
        el={TykGraphiQL}
        fetcher={fetcher}
        schema={graphqlSchema}
        query={query}
        ideName=''
        onEditQuery={editQuery}
      />
    {/await}
  </div>
  
  <div id="pageFoot" class="relative block sm:flex sm:items-center px-3 py-2 shadow bg-white dark:bg-slate-900 z-20">
    <span class="font-semibold dark:text-slate-50 whitespace-nowrap mr-1">Last Query</span>
    <div class="flex items-center cursor-pointer text-xl sm:text-sm text-slate-600 dark:text-slate-400 px-2 py-1 mr-3 w-max rounded hover:bg-slate-100 dark:hover:bg-slate-700">
      <span class="font-mono mr-1 line-clamp-1">{query}</span>
      <Icon size="14" className="text-slate-400 fill-current ml-1" src={IoFlask} />
    </div>
    <div use:clickOutside on:outside={() => (uiState.createFromQueryDropState = false)} class="relative ml-auto mr-0 mb-2 sm:mb-0">
      <button on:click={() => (uiState.createFromQueryDropState = true)} class="btn-default">
        <Icon size="14" className="fill-current mr-1" src={BiPlus} />
        Save As
      </button>
      {#if uiState.createFromQueryDropState}
        <div class="absolute p-1 right-0 bottom-8 mb-1.5 rounded shadow text-slate-50 bg-slate-900 dark:bg-slate-600 dark:border dark:border-slate-400"> 
          <p class="pt-1 pb-0.5 px-2 whitespace-nowrap text-gray-300 text-sm">GraphiQL Workspace</p>
          <div on:click={() => (uiState.createFromQueryDropState = false)} class="flex items-center cursor-pointer whitespace-nowrap py-1 px-2 rounded hover:bg-slate-600 dark:hover:bg-slate-900">
            Collection Item
          </div>
          <div on:click={() => (uiState.createFromQueryDropState = false)} class="flex items-center cursor-pointer whitespace-nowrap py-1 px-2 rounded hover:bg-slate-600 dark:hover:bg-slate-900">
            REST Endpoint
          </div>
          <div on:click={() => (uiState.createFromQueryDropState = false)} class="flex items-center cursor-pointer whitespace-nowrap py-1 px-2 rounded hover:bg-slate-600 dark:hover:bg-slate-900">
            REST Connector Definition
          </div>
          <hr class="border-0 border-t border-slate-400 my-1" />
          <p class="pt-1 pb-0.5 whitespace-nowrap px-2 text-gray-300 text-sm">Last Query</p>
          <div on:click={() => (uiState.createFromQueryDropState = false)} class="flex items-center cursor-pointer whitespace-nowrap py-1 px-2 rounded hover:bg-slate-600 dark:hover:bg-slate-900">
            Collection Item
          </div>
          <div on:click={() => (uiState.createFromQueryDropState = false)} class="flex items-center cursor-pointer whitespace-nowrap py-1 px-2 rounded hover:bg-slate-600 dark:hover:bg-slate-900">
            REST Endpoint
          </div>
          <div on:click={() => (uiState.createFromQueryDropState = false)} class="flex items-center cursor-pointer whitespace-nowrap py-1 px-2 rounded hover:bg-slate-600 dark:hover:bg-slate-900">
            REST Connector Definition
          </div>
        </div>
      {/if}
    </div>    
  </div>

  <Footer />
</main>