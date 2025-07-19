(function(){
  var saved = localStorage.getItem('theme');
  if(saved === 'dark' || saved === 'light') {
    document.documentElement.setAttribute('data-theme', saved);
  }
})();
