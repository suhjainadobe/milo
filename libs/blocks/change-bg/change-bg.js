import { getConfig } from '../../utils/utils.js';
const config = getConfig();
const base = config.codeRoot;
const customElem = document.createElement('ft-changebackgroundmarquee');

function getAssests() {
  customElem.config = {
    desktop: {
      marqueeTitleImgSrc: `${base}/assets/desktop/everyonecanphotoshop.webp`,
      talentSrc: `${base}/assets/desktop/yogalady.webp`,
      defaultBgSrc: `${base}/assets/desktop/defaultBg.webp`,
      tryitSrc: `${base}/assets/tryit.svg`,
      tryitText: 'それを試してみてください',
      cursorSrc: `${base}/assets/desktop/dt-Mouse-arrow.svg`,
      groups: [
        {
          name: 'Remove Background',
          iconUrl: `${base}/assets/remove-background-icon.svg`
        },
        {
          name: 'Change Photo',
          iconUrl: `${base}/assets/change-photo-icon.svg`,
          options: [
            {
              src: `${base}/assets/desktop/photo1.webp`,
              swatchSrc: `${base}/assets/photo-submenu-1.png`
            },
            {
              src: `${base}/assets/desktop/photo2.webp`,
              swatchSrc: `${base}/assets/photo-submenu-2.png`
            },
            {
              src: `${base}/assets/desktop/photo3.webp`,
              swatchSrc: `${base}/assets/photo-submenu-3.png`
            }
          ]
        },
        {
          name: 'Change Color',
          'iconUrl': `${base}/assets/change-color-icon.svg`,
          'options': [
            {
              'src': '#31A8FF'
            },
            {
              'src': '#7F66E6'
            },
            {
              'src': '#31F7FF'
            }
          ]
        },
        {
          'name': 'Change Pattern',
          'iconUrl': `${base}/assets/change-pattern-icon.svg`,
          'options': [
            {
              'src': `${base}/assets/desktop/pattern1.webp`,
              'swatchSrc': `${base}/assets/pattern-submenu-1.png`
            },
            {
              'src': `${base}/assets/desktop/pattern2.webp`,
              'swatchSrc': `${base}/assets/pattern-submenu-2.png`
            },
            {
              src: `${base}/assets/desktop/pattern3.webp`,
              swatchSrc: `${base}/assets/pattern-submenu-3.png`
            }
          ]
        }
      ]
    },
    'tablet': {
      'marqueeTitleImgSrc': `${base}/assets/tablet/everyonecanphotoshop.webp`,
      'talentSrc': `${base}/assets/tablet/yogalady.webp`,
      'defaultBgSrc': `${base}/assets/tablet/defaultBg.webp`,
      'tryitSrc': `${base}/assets/tryit.svg`,
      'tryitText': 'Versuch es',
      'groups': [
        {
          'name': 'Remove Background',
          'iconUrl': `${base}/assets/remove-background-icon.svg`
        },
        {
          'name': 'Change Photo',
          'iconUrl': `${base}/assets/change-photo-icon.svg`,
          'options': [
            {
              'src': `${base}/assets/tablet/photo1.webp`,
              'swatchSrc': `${base}/assets/photo-submenu-1.png`
            }
          ]
        },
        {
          'name': 'Change Color',
          'iconUrl': `${base}/assets/change-color-icon.svg`,
          'options': [
            {
              'src': '#31A8FF'
            }
          ]
        },
        {
          'name': 'Change Pattern',
          'iconUrl': `${base}/assets/change-pattern-icon.svg`,
          'options': [
            {
              'src': `${base}/assets/tablet/pattern1.webp`,
              'swatchSrc': `${base}/assets/pattern-submenu-1.png`
            }
          ]
        }
      ]
    },
    'mobile': {
      'marqueeTitleImgSrc': `${base}/assets/mobile/everyonecanphotoshop.webp`,
      'talentSrc': `${base}/assets/mobile/yogalady.webp`,
      'defaultBgSrc': `${base}/assets/mobile/defaultBg.webp`,
      'tryitSrc': `${base}/assets/tryit.svg`,
      'tryitText': 'Try it',
      'groups': [
        {
          'name': 'Remove Background',
          'iconUrl': `${base}/assets/remove-background-icon.svg`
        },
        {
          'name': 'Change Photo',
          'iconUrl': `${base}/assets/change-photo-icon.svg`,
          'options': [
            {
              'src': `${base}/assets/mobile/photo1.webp`,
              'swatchSrc': `${base}/assets/photo-submenu-1.png`
            }
          ]
        },
        {
          'name': 'Change Color',
          'iconUrl': `${base}/assets/change-color-icon.svg`,
          'options': [
            {
              'src': '#31A8FF'
            }
          ]
        },
        {
          'name': 'Change Pattern',
          'iconUrl': `${base}/assets/change-pattern-icon.svg`,
          'options': [
            {
              'src': `${base}/assets/mobile/pattern1.webp`,
              'swatchSrc': `${base}/assets/pattern-submenu-1.png`
            }
          ]
        }
      ]
    }
  };
}

export default function init(el) {
  console.log('init', el)

  fetch(`${base}/assets/mobile/defaultBg.webp`)

  const clone = el.cloneNode(true);
  window.__satelliteLoadedPromise = Promise.resolve(false);

  import(`${base}/deps/interactive-marquee/ft-everyonechangebgmarquee-41eebb1a.js`);
  getAssests(clone);
  el.innerText = '';
  el.appendChild(customElem);
}
