<script>
  // ==== Import Routes ====
  import { Router, Route } from "svelte-navigator";
  
  // --> Login
  import Login from "@/routes/login/Login.svelte";
  // --> API Pages
  import GraphiQL from "@/routes/api/GraphiQL.svelte";
  import Collections from "@/routes/api/Collections.svelte";
  // --> Login
  import Users from "@/routes/settings/Users.svelte";
</script>

<!-- Router -->
<Router primary={false}>
  <!-- Login -->
  <Route path="/"> <Login /> </Route>
  <Route path="/login"> <Login /> </Route>
  <!-- API -->
  <Route path="/api"> <GraphiQL /> </Route>
  <Route path="/api/graphiql"> <GraphiQL /> </Route>
  <Route path="/api/collections"> <Collections /> </Route>
  <!-- Settings -->
  <Route path="/settings"> <Users /> </Route>
  <Route path="/settings/users"> <Users /> </Route>
</Router>