import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
    // создаём компаратор: сначала пропускаем пустые значения, затем ищем по нескольким полям
    const comparator = createComparison([
        rules.skipEmptyTargetValues,
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    ]);

    // возвращаем функцию, которая будет применяться в конвейере render()
    return (data, state, action) => {
        const target = state[searchField];
        return comparator(data, target, action);
    };
}