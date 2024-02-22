import { createTag, getConfig } from '../../utils/utils.js';
const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

export default async function init(el) {
  // const className = el.previousElementSibling.classList[0];
  // let path = `${base}/blocks/${className}`;
  // const blockPath = `${path}/${className}`;
  // const { default: init } = await import(`${blockPath}.js`);
  // await init(el.previousElementSibling);
    let isDragging = false;
    let offsetX, offsetY;
    // console.log('ss', el.previousElementSibling.classList); 
    const section = el.closest('.section').previousElementSibling;
    const section1 = el.closest('.section')
    const ydiv = section.querySelector('.interactive');
    ydiv.classList.add('section-layer');
    section1.classList.add('top-layer');
    var rect = ydiv.getBoundingClientRect();
    section1.style.left = rect.left + 'px';
    section1.style.top = rect.top + 'px';
    section1.style.height = rect.height + 'px';
    const HUE_SLIDER = `  <div>
    <input type="range" id="hueSlider" min="0" max="360" value="180" style="background-image: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red);">
</div>`;
const SATURATION_SLIDER = `  <div>
<input type="range" id="saturationSlider" min="0" max="100" value="50">
</div>`;
const UPLOAD_IMAGE = `<input type="file" id="imageUpload" accept="image/*">`;
const menu = createTag(
  'div',
  {
    class: 'optionMenu',
    // 'draggable': 'true',
  },
);
    const hue = createTag(
      'div',
      {
        class: 'table-block',
      },
      HUE_SLIDER,
    );
    const saturation = createTag(
      'div',
      {
        class: 'table-block',
      },
      SATURATION_SLIDER,
    );
    const upload_image = createTag(
      'div',
      {
        class: 'upload-image',
      },
      UPLOAD_IMAGE,
    );
    menu.append(hue);
    menu.append(saturation);
    menu.append(upload_image);
     el.append(menu);
const tag = ydiv.querySelectorAll('picture')[1];
console.log('tag', tag);
const picTag = tag.querySelector('img');
const picPosition = picTag.getBoundingClientRect();
console.log('picPosition', picPosition);
menu.style.top = '50%';
// menu.style.transform = 'translateY(-' + picPosition + 'px)';
// console.log('picTag.offsetWidth ', picTag.offsetHeight );
menu.style.left = (picPosition.right - 100) + 'px';
const hueSlider = el.querySelector('#hueSlider');
hueSlider.addEventListener('input', function() {
  const hueValue = this.value;
  picTag.style.filter = `hue-rotate(${hueValue}deg)`;
});
const saturationSlider = el.querySelector('#saturationSlider');
saturationSlider.addEventListener('input', function() {
  const saturationValue = this.value;
  picTag.style.filter = `saturate(${saturationValue}%)`;
});

el.querySelector('#imageUpload').addEventListener('change', function(event) {
  // const imageContainer = document.getElementById('imageContainer').querySelector('img');
  const file = event.target.files[0];

  if (file) {
    const sources = tag.querySelectorAll('source');
    console.log('sources', sources, tag);
      sources.forEach(source => source.remove());
      const imageUrl = URL.createObjectURL(file);
      picTag.src = imageUrl;
      // picTag.onload = () => URL.revokeObjectURL(imageUrl); // Free memory when the image is loaded
  }
});
}