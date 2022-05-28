/*! JSON.minify()
v3.0.0 (c) Kyle Simpson
MIT License
*/(function(global){if(typeof global.JSON=="undefined"||!global.JSON){global.JSON={};}
global.JSON.minify=function JSON_minify(json){var tokenizer=/"|(\/\*)|(\*\/)|(\/\/)|\n|\r/g,in_string=false,in_multiline_comment=false,in_singleline_comment=false,tmp,tmp2,new_str=[],ns=0,from=0,lc,rc,prevFrom;tokenizer.lastIndex=0;while(tmp=tokenizer.exec(json)){lc=RegExp.leftContext;rc=RegExp.rightContext;if(!in_multiline_comment&&!in_singleline_comment){tmp2=lc.substring(from);if(!in_string){tmp2=tmp2.replace(/(\n|\r|\s)+/g,"");}
new_str[ns++]=tmp2;}
prevFrom=from;from=tokenizer.lastIndex;if(tmp[0]=="\""&&!in_multiline_comment&&!in_singleline_comment){tmp2=lc.substring(prevFrom).match(/\\+$/);if(!in_string||!tmp2||(tmp2[0].length%2)==0){in_string=!in_string;}
from--;rc=json.substring(from);}
else if(tmp[0]=="/*"&&!in_string&&!in_multiline_comment&&!in_singleline_comment){in_multiline_comment=true;}
else if(tmp[0]=="*/"&&!in_string&&in_multiline_comment&&!in_singleline_comment){in_multiline_comment=false;}
else if(tmp[0]=="//"&&!in_string&&!in_multiline_comment&&!in_singleline_comment){in_singleline_comment=true;}
else if((tmp[0]=="\n"||tmp[0]=="\r")&&!in_string&&!in_multiline_comment&&in_singleline_comment){in_singleline_comment=false;}
else if(!in_multiline_comment&&!in_singleline_comment&&!(/\n|\r|\s/.test(tmp[0]))){new_str[ns++]=tmp[0];}}
new_str[ns++]=rc;return new_str.join("");};})(typeof globalThis!="undefined"?globalThis:typeof global!="undefined"?global:typeof window!="undefined"?window:typeof self!="undefined"?self:typeof this!="undefined"?this:{});