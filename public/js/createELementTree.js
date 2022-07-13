const createElementTree = (elements) => {
  const [tag, ...children] = elements;
  const [tagName, className] = tag.split(".");
  const parent = document.createElement(tagName);

  if (className) parent.className = className;

  if (children && !Array.isArray(children[0])) {
    parent.innerText = children[0].toString();
    return parent;
  }

  children.forEach(child => parent.appendChild(createElementTree(child)));
  return parent;
};
