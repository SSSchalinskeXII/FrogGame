// This is from https://phasergames.com/using-google-fonts-phaser/
// It was copied and pasted with only the font names changed on row 5

WebFontConfig = {
google: { families: 'Source Code Pro' }
};
(function() {
var wf = document.createElement('script');
wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
wf.type = 'text/javascript';
wf.async = 'true';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(wf, s);
})();