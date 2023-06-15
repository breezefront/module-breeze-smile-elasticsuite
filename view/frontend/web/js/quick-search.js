define([
    'jquery',
    'underscore',
    'Magento_Catalog/js/price-utils'
], function ($, _, priceUtil) {
    'use strict';

    $.widget('smileEs.quickSearch', 'quickSearch', {
        options: {
            minSearchLength: 2,
            dropdown: '<div></div>',
            dropdownClass: 'smile-elasticsuite-autocomplete-result',
            responseFieldElements: 'dd'
        },

        _create: function () {
            this.templateCache = {};

            this._super();

            this.autoComplete.on('keydown.smileEs', this.options.responseFieldElements, (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    event.stopPropagation();
                    this.submitSelectedItem();
                }
            });
        },

        submitSelectedItem: function () {
            var item = this.dataset[this.responseList.selectedIndex];

            if (!item) {
                return;
            }

            if (item.url) {
                window.location.href = item.url;
            } else {
                this.searchForm.submit();
            }
        },

        sendRequest: function () {
            var result = this._super(),
                spinnerTarget = this.searchForm.find('.actions');

            if (!result || !result.finally) {
                return result;
            }

            spinnerTarget.spinner(true, {
                delay: 200
            });

            return result.finally(function () {
                spinnerTarget.spinner(false);
            });
        },

        renderItem: function (item) {
            if (item.price && (!isNaN(item.price))) {
                item.price = priceUtil.formatPrice(item.price, this.options.priceFormat);
            }

            if (!item.row_class) {
                item.row_class = '';
            }
            item.row_class += 'item-type-' + item.type;

            return this.renderItemTitle(item) + this._super(item);
        },

        renderItemTitle: function (item) {
            // render title before the first item only
            if (this.renderedTitles[item.type]) {
                return '';
            }

            this.renderedTitles[item.type] = true;

            var title = '',
                template = this.getItemTemplate(item, 'titleRenderer');

            if (template) {
                title = template(item);
            } else if (this.options.templates[item.type].title) {
                title = this.options.templates[item.type].title;
            }

            if (title.length) {
                title = '<dt role="listbox" class="autocomplete-list-title title-' + item.type + '">' + title + '</dt>';
            }

            return title;
        },

        getItemTemplate: function (item, template = 'template') {
            var key = item.type + template,
                id = this.options.templates[item.type][template];

            if (!this.templateCache[key] && id) {
                this.templateCache[key] = _.template(
                    document.getElementById(`${id}.html`)?.innerHTML || ''
                );
            }

            return this.templateCache[key];
        },

        processResponse: function () {
            this.renderedTitles = {};
            this._super();
            this.addWrappers();
        },

        addWrappers: function () {
            var prev = false,
                collection = $();

            $(`.${this.options.dropdownClass} > dd`).each((i, el) => {
                var match = el.className.match(/item-type-(?<type>\w+)/),
                    current = match.groups.type;

                if (prev && prev !== current) {
                    collection.wrapAll('<dl role="listbox" class="autocomplete-list"></dl>')
                    collection = $();
                }

                collection = collection.add($(el).prev('dt'));
                collection = collection.add(el);
                prev = current;
            });

            if (collection.length) {
                collection.wrapAll('<dl role="listbox" class="autocomplete-list"></dl>')
            }
        }
    });
});
