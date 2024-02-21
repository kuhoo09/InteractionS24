var body = document.getElementsByTagName('BODY')[0];
var sliderValue = document.getElementById('range');

sliderValue.oninput = function()
{

var color1 = this.value;
var color2 = 80-color1;    

var bg = 'linear-gradient(90deg, #101010, #101010 '+color1+'%, #101010 '+color1+'%, black '+color1+'% , black '+color2+'%)';
    
body.style.setProperty('background', bg);    
}
