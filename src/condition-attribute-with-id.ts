export function conditionAttributeWithoutId(
    el: HTMLElement,
    attribute: string,
    ids: string[]
): void {
    const ariaDescribedby = el.getAttribute(attribute);
    let descriptors = ariaDescribedby ? ariaDescribedby.split(/\s+/) : [];
    descriptors = descriptors.filter(
        (descriptor) => !ids.find((id) => descriptor === id)
    );
    if (descriptors.length) {
        el.setAttribute(attribute, descriptors.join(' '));
    } else {
        el.removeAttribute(attribute);
    }
}

export function conditionAttributeWithId(
    el: HTMLElement,
    attribute: string,
    id: string | string[]
): () => void {
    const ids = Array.isArray(id) ? id : [id];
    const ariaDescribedby = el.getAttribute(attribute);
    const descriptors = ariaDescribedby ? ariaDescribedby.split(/\s+/) : [];
    const hadIds = ids.every((currentId) => descriptors.indexOf(currentId) > -1);
    if (hadIds) return function noop() {};
    descriptors.push(...ids);
    el.setAttribute(attribute, descriptors.join(' '));
    return () => conditionAttributeWithoutId(el, attribute, ids);
}