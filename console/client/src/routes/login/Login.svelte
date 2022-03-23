<svelte:head>
	<meta name="robots" content="noindex nofollow" />
	<html lang="en" />
	<title>Hasura Watchtower - Login</title>
</svelte:head>

<script>
  import { onMount } from 'svelte';

  import Icon from 'svelte-icons-pack/Icon.svelte';
  import VscGithubInverted from 'svelte-icons-pack/vsc/VscGithubInverted';
</script>

<main class="bg-slate-800 text-slate-900 antialiased py-20 w-full h-screen">
  <div class="max-w-2xl mx-auto ">
    <img class="mx-auto mb-4" src="/images/logomark-white.svg" style="height: 54px;" alt="Hasura Logo"/>
    <div class="mb-8 text-center">
      <h1 class="text-4xl text-white font-extrabold">Sign in to your Console</h1>
    </div>
    <div class="flex shadow-lg bg-white rounded overflow-hidden">
      <div class="p-4 w-4/6">
        <div class="mb-2">
          <p class="mb-1 font-semibold">Username</p>
          <input type="text" placeholder="Username..." class="input-base lrg" />  
        </div>
        <div class="mb-4">
          <p class="mb-1 font-semibold">Password</p>
          <input type="password" placeholder="Password..." class="input-base lrg" />  
        </div>
        <a href="/api/graphiql">
          <button class="btn-primary w-full lrg">Sign In</button>
        </a>
      </div>
      <div class="p-4 w-2/6 border-l border-slate-200 bg-gray-50">
        <p class="mb-2">
          Feedback?<br /> Like to contribute?<br /> Discuss this project over on GitHub Discussions.
        </p>
        <a target="_new" href="https://github.com/m-rgba/hasura-watchtower/discussions">
          <button class="flex items-center btn-default w-full">
            <Icon size="15" className="fill-current mr-1.5" src={VscGithubInverted} />
            GitHub
          </button>  
        </a>
      </div>  
    </div>  
  </div>
</main>