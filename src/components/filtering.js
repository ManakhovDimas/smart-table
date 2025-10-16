export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    // код с обработкой очистки поля
    const applyFiltering = (query, state, action) => {
        // код с обработкой очистки поля
        if (action && action.name === 'clear' && action.fields) {
            action.fields.forEach(fieldName => {
                console.log(`Начинается очистка поля: ${fieldName}`);
                Object.keys(elements).forEach((k) => {
                    const el = elements[k];
                    if (!el) return;
                    const elName = el.getAttribute && (el.getAttribute('name') || el.getAttribute('data-field')) || el.id;
                    if (elName === fieldName) {
                        if ('value' in el) el.value = '';
                    }
                });

                if (state && Object.prototype.hasOwnProperty.call(state, fieldName)) {
                    state[fieldName] = '';
                }
            });
        }

        // @todo: #4.5 — отфильтровать данные, используя компаратор
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }
}