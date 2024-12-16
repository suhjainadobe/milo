module.exports = {
  name: 'Personalization Feature',
  features: [
    {
      tcid: '0',
      name: '@Replace content',
      desc: 'Personalization with action=replaceContent',
      path: '/drafts/nala/features/personalization/pzn-replacecontent',
      data: {
        target: 'textpersonlization',
        pznExpName: 'param-target=textpersonlization',
        pznFileName: 'pzn1',
        h3Text: 'Text',
      },
      tags: '@pzn @smoke @regression @milo ',
    },
    {
      tcid: '1',
      name: '@Insert Content Before',
      desc: 'Personalization with action=insertContentBefore',
      path: '/drafts/nala/features/personalization/pzn-insertcontent-before',
      data: {
        target: 'textpersonlization',
        pznExpName: 'param-target=textpersonlization',
        pznFileName: 'insert-content-before',
        h3Text: 'Text',
      },
      tags: '@pzn @smoke @regression @milo ',
    },
    {
      tcid: '2',
      name: '@Insert Content After',
      desc: 'Personalization with action=insertContentAfter',
      path: '/drafts/nala/features/personalization/pzn-insertcontent-after',
      data: {
        target: 'textpersonlization',
        pznExpName: 'param-target=textpersonlization',
        pznFileName: 'insert-content-before',
        h3Text: 'Text',
      },
      tags: '@pzn @smoke @regression @milo ',
    },
    {
      tcid: '3',
      name: '@Replace Fragment',
      desc: 'Personalization with action=replaceFragment',
      path: '/drafts/nala/features/personalization/legacy/replace-fragment',
      data: { defaultURLpath: '/drafts/nala/features/personalization/legacy/replace-fragment?mep=%2Fdrafts%2Fnala%2Ffeatures%2Fpersonalization%2Flegacy%2Freplace-fragment.json--default' },
      tags: '@pzn @pzn3 @smoke @regression @milo ',
    },
    {
      tcid: '4',
      name: '@Remove Content',
      desc: 'Personalization with action=removeContent',
      path: '/drafts/nala/features/personalization/legacy/remove-content',
      data: { defaultURLpath: '/drafts/nala/features/personalization/legacy/remove-content?mep=%2Fdrafts%2Fnala%2Ffeatures%2Fpersonalization%2Flegacy%2Fremove-content.json--default' },
      tags: '@pzn @pzn4 @smoke @regression @milo ',
    },
  ],
};