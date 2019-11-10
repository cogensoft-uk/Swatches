define(['jquery', 'ddslick'], function ($, ddSlick) {
  'use strict';

  return function (SwatchRenderer) {
    $.widget('mage.SwatchRenderer', $['mage']['SwatchRenderer'], {
      mixinOptions: {},
      _init: function () {
        this.mixinOptions = {
          classes: {
            pageTitle: '.page-title > span',
            container: '.swatch-opt',
            optionsContainer: '[attribute-code]',
            optionsInner: '.swatch-attribute-options',
            option: '.swatch-option',
            label: '.swatch-attribute-label'
          },
          selectors : []
        };
        this._super();
      },
      _RenderControls: function () {
        this._super();

        //Add additional controls
        this._addShowMore();
        this._RenderSlickSelect();
        this._BindToSwatchClicks();
      },
      _addShowMore: function() {
        var settings = this.mixinOptions;
        var $optionContainer = $(settings.classes.container + ' ' + settings.classes.optionsInner);

        if($optionContainer.find(settings.classes.option).length >= 16) {
          var moreLink = document.createElement('a');
          moreLink.textContent = 'Show more...';
          moreLink.id = 'swatches-more';
          moreLink.addEventListener('click', function(e) {
            e.preventDefault();
            $(this).parent().toggleClass('show-all');
            $(this).text($(this).text() == 'Show more...' ? 'Show less...' : 'Show more...' );
          });
          $optionContainer.append(moreLink);
        }
    },
      _RenderSlickSelect: function () {
        var settings = this.mixinOptions;
        var $container = $(settings.classes.container);
        if($container.length === 0) return;

        $container.find('> ' + settings.classes.optionsContainer).each(function() {
          var $optionContainer = $(this);

          //Only continue with swatch attributes
          if($optionContainer.find('.swatch-option.image, .swatch-option.color').length === 0) return;

          var attributeId = $optionContainer.attr('attribute-id');
          var attributeCode = $optionContainer.attr('attribute-code');
          var $oldLabel = $optionContainer.find(settings.classes.label);
          var label = document.createElement('label');
          var select = document.createElement('select');
          var selectId = 'swatch-select-' + attributeId;
          var ddData = [];

          settings.selectors[attributeId] = [];
          select.id = selectId;

          label.textContent = $oldLabel.text();
          label.setAttribute('for', selectId);
          $oldLabel.hide();

          $optionContainer.find(settings.classes.optionsInner + ' '  + settings.classes.option).each(function() {
            var $swatchOption = $(this);
            var swatchOptionId = $swatchOption.attr('option-id');
            var swatchLabel = $swatchOption.attr('option-label');
            var swatchSlickData = {
              text: swatchLabel,
              value: swatchOptionId,
            };

            (settings.selectors[attributeId]).push(swatchOptionId);

            if($swatchOption.hasClass('color')) {
              var swatchColour = String($swatchOption.attr('option-tooltip-value')).replace('#','');
              swatchSlickData.imageSrc = "/swatches/sample/get?colour=" + swatchColour;
            }
            else if($swatchOption.hasClass('image')) {
              swatchSlickData.imageSrc = $swatchOption.attr('option-tooltip-value');
            }

            ddData.push(swatchSlickData);
          });

          $optionContainer.prepend(select);
          var $select = $optionContainer.find('#'+selectId);
          $select.ddslick({
            data: ddData,
            imagePosition: "left",
            selectText: "Choose an Option...",
            onSelected: function(data) {
             if(!$select.hasClass('updating')) {
               var swatchOptionId = data.selectedData.value;
               var $swatch = $container.find('#option-label-' + attributeCode + '-' + attributeId + '-item-' + swatchOptionId + ':not(.updating)');
               $swatch.addClass('updating').trigger('click').removeClass('updating');
               $(settings.classes.pageTitle).text($swatch.attr('option-label'));
             }

            }
          });

          //Need to find it again as ddslick destroys the original
          var $select = $optionContainer.find('#'+selectId);
          $select.attr('data-attribute-code', attributeCode).addClass('swatch-selector');

          $optionContainer.prepend(label);
        });
      },
      _BindToSwatchClicks: function() {
        var settings = this.mixinOptions;
        var $container = $(settings.classes.container);
        if($container.length === 0) return;
        if((settings.selectors).length === 0) return;

        settings.selectors.forEach(function (swatchOptions, attributeId) {
          var $select = $container.find('#swatch-select-' + attributeId);
          var attributeCode = $select.attr('data-attribute-code');

          //Bind to swatch image clicks
          if(swatchOptions.length > 0) {
            var optionIdx = 0;
            swatchOptions.forEach(function(swatchOptionId) {

              var $swatch = $container.find('#option-label-' + attributeCode + '-' + attributeId + '-item-' + swatchOptionId + ':not(.updating)');

              $swatch.attr('data-idx', optionIdx);
              $swatch.on('click', function() {
                setTimeout(function() {
                  $select.addClass('updating').ddslick('select', {index: $swatch.attr('data-idx')}).removeClass('updating');
                  $(settings.classes.pageTitle).text($swatch.attr('option-label'));
                }, 10);
              });

             optionIdx++;
            });
          }
        });
      }
    });
    return $['mage']['SwatchRenderer'];
  };
});