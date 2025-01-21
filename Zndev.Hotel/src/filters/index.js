export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function replaceImgToLazyload(content){
	return content.replace(/(\<img\s+.*?)(src=)([\'"]?)/gi,'$1data-src=$3');
}


 
