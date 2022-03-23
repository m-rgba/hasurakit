/* This is the global store - it should be reserved for ONLY global variables */
import { writable } from 'svelte/store';

// Retrieve current from localstorage / cast to boolean (localstorage only string)
const darkModeLocal = localStorage.settingDarkMode
function loadDarkMode(){
    if( darkModeLocal === 'true' ){ 
        return true 
    } else { 
        return false 
    }    
}
// Load Store
export const darkMode = writable(loadDarkMode() || false)
// Stash
darkMode.subscribe((value) => localStorage.settingDarkMode = value)