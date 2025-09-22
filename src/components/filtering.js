import { createComparison, defaultRules } from "../lib/compare.js";

export function initFiltering(elements = {}, indexes = {}) {
    // #4.1 — заполнить выпадающие списки опциями
    // Ожидается что elements — объект вида { searchBySeller: <select>, ... }
    Object.keys(indexes).forEach((elementName) => {
        const el = elements[elementName];
        if (!el) return;
        // подготовим опции: <option value="name">name</option>
        const options = Object.values(indexes[elementName])
            .map((name) => {
                const o = document.createElement("option");
                o.value = name;
                o.textContent = name;
                return o;
            });
        // добавим пустой первый option для "не выбрано"
        const empty = document.createElement("option");
        empty.value = "";
        empty.textContent = "";
        el.append(empty, ...options);
    });

    // #4.3 — настроить компаратор
    const compare = createComparison(defaultRules);

    return (data, state = {}, action = {}) => {
        // #4.2 — обработать очистку поля
        // Ожидаем action = { type: 'click', name: 'clear', node: <button> } или похожим образом
        if (action && action.name === "clear" && action.node) {
            // кнопка должна иметь data-field с именем поля, которое очищаем
            const fieldName = action.node.getAttribute && action.node.getAttribute("data-field");
            if (fieldName) {
                // найти input/select рядом в родителе кнопки
                const parent = action.node.parentElement;
                if (parent) {
                    const input = parent.querySelector(`[name="${fieldName}"], [data-field="${fieldName}"], #${fieldName}`);
                    if (input) {
                        input.value = "";
                    }
                }
                // сбросить и в state
                if (state && Object.prototype.hasOwnProperty.call(state, fieldName)) {
                    state[fieldName] = "";
                }
            }
        }

        // #4.5 — отфильтровать данные используя компаратор
        // compare(row, state) должен возвращать true/false в соответствии с defaultRules
        return data.filter((row) => compare(row, state));
    };
}
