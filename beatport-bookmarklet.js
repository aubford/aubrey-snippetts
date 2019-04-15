/* eslint-disable */
const testString = 'I Get Deep (feat Roland Clark - Late Nite Tuff Guy Remix/Emanuel Satie Rework)'
const testStringB = 'Panic by Jamie Jones  — Buy'


javascript:(function() {
  var formatString = str => str
    .replace('/', ' ')
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .map(wrd => wrd.trim())
    .filter(wrd => wrd && wrd !== 'feat' && wrd !== 'by' && wrd !== 'Buy')
    .join('+');
  window.open(
    'https://www.beatport.com/search?q=' +
    formatString(
    document.getElementsByClassName('current-track')[0].innerText + ' ' +
    document.getElementsByClassName('current-artist')[0].innerText
    ),
    '_blank'
  );
})()
