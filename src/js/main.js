
import foo from './modules/utils.js'


var el = document.querySelector('#test');
el.addEventListener('click', () =>{
 if(true){
     console.log('Clicked the test selector!');
     foo();
 }
});