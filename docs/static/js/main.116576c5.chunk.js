(this.webpackJsonpwebengine=this.webpackJsonpwebengine||[]).push([[0],{12:function(t,e,n){},13:function(t,e,n){"use strict";n.r(e),n.d(e,"App",(function(){return I}));var i=n(1),r=n.n(i),o=n(6),a=n.n(o),c=(n(12),n(5),n(3)),u=n(2),s=function t(){Object(u.a)(this,t)};s.OffsetAnimationComponent=function(t){return function(e){return function(n){return function(i){return{update:function(r,o,a,u){if(n){var s=n(r,o,a,u),p=Object(c.a)(s,2);o=p[0],u=p[1]}if(o.properties.position={x:o.properties.position.x+t(r,o.properties.position.x,o.properties.position.y),y:o.properties.position.y+e(r,o.properties.position.x,o.properties.position.y)},i){var f=i(r,o,a,u),d=Object(c.a)(f,2);o=d[0],u=d[1]}return[o,u]}}}}}},s.PositionAnimationComponent=function(t){return function(e){return function(n){return function(i){return{update:function(r,o,a,u){if(n){var s=n(r,o,a,u),p=Object(c.a)(s,2);o=p[0],u=p[1]}if(o.properties.position={x:t(r,o.properties.position.x,o.properties.position.y),y:e(r,o.properties.position.x,o.properties.position.y)},i){var f=i(r,o,a,u),d=Object(c.a)(f,2);o=d[0],u=d[1]}return[o,u]}}}}}};var p=n(0),f=function t(){Object(u.a)(this,t)};f.WorldToCameraCoords=function(t,e){return{x:t.x-e.position.x,y:t.y-e.position.y}},f.CenterCameraOnVector2=function(t,e){return Object(p.a)(Object(p.a)({},e),{},{position:{x:t.x-e.size.width/2,y:t.y-e.size.height/2}})};var d=function(t){var e=j.Game.InitEngine(void 0,t);return e=j.Scene.CreateScene(e)("root",!0),x(e)},l=0,h=!1,x=function(t){var e=t,n=j.Entity.MakeEntity({position:{x:50,y:50},anchor:{x:0,y:0},size:{width:50,height:50},rotation:0,scale:{x:1,y:1}},[{update:function(t,e,n,i){return e.properties.rotation=e.properties.rotation+t/1e3*.4*Math.PI,[e,i]}}],j.Renderer.BoxRenderer(e)(E.rgbaToColor(255,0,255,1)),[]),i=j.Entity.MakeFolderEntity(e)([n]);i.properties.position={x:100,y:100},i.components.push({update:function(t,e,n,i){return[Object(p.a)(Object(p.a)({},e),{},{properties:Object(p.a)(Object(p.a)({},e.properties),{},{rotation:e.properties.rotation+t/1e3*.4*Math.PI})}),i]}});var r=j.Entity.MakeFolderEntity(e)([i]);r.properties.position={x:100,y:100},r.components.push({update:function(t,e,n,i){return[Object(p.a)(Object(p.a)({},e),{},{properties:Object(p.a)(Object(p.a)({},e.properties),{},{rotation:e.properties.rotation+t/1e3*.4*Math.PI})}),i]}});var o=j.Entity.MakeFolderEntity(e)([r]);return o.properties.position={x:100,y:100},o.components.push({update:function(t,e,n,i){return[Object(p.a)(Object(p.a)({},e),{},{properties:Object(p.a)(Object(p.a)({},e.properties),{},{rotation:e.properties.rotation+t/1e3*.4*Math.PI})}),i]}}),e=j.Scene.AddEntityToScene(e)("root")(o)},y=function t(){Object(u.a)(this,t)};y.CreateRotation=function(t){return function(){return"rotate("+t+"rad)"}},y.CreateScale=function(t){return function(){return"scale("+t.x+","+t.y+")"}},y.CreateTransform=function(t){return t.reduce((function(t,e){return t+" "+e()}),"")},y.ComputeEntityWorldTransformation=function(t){return function(t){var e=C.RotatePositionAboutPoint(-t.properties.rotation)(t.properties.anchor)(t.properties.position);return{translation:{x:e.x-t.properties.anchor.x,y:e.y-t.properties.anchor.y},finalPosition:e,scale:t.properties.scale,rotation:t.properties.rotation,anchor:t.properties.anchor}}},y.TransformationToStyle=function(t){return function(e,n){return{position:"absolute",width:n.properties.size.width,height:n.properties.size.height,left:t.config.width/2+e.finalPosition.x-e.scale.x*n.properties.size.width/2,top:t.config.height/2+e.finalPosition.y-e.scale.y*n.properties.size.height/2,transform:y.CreateTransform([y.CreateScale(e.scale),y.CreateRotation(e.rotation)])}}};var v=function t(){Object(u.a)(this,t)};v.BasicTextureRenderer=function(t){return function(t){throw new Error("unimplemented!")}},v.BoxRendererReact=function(t){return function(t){return function(e){return function(n){var i=y.ComputeEntityWorldTransformation(e)(n),o=y.TransformationToStyle(e)(i,n);return r.a.createElement("div",{style:Object(p.a)(Object(p.a)({},o),{},{background:E.ColorToString(t)})})}}}},v.BoxRenderer=function(t){if(null===t.canvas)throw new Error("Cannot render with a canvas renderer without a canvas being linked to the engine state!");return function(t){return function(e){return function(n){var i;if(null===e.canvas)throw new Error("Cannot render with a canvas renderer without a canvas being linked to the engine state!");var r=y.ComputeEntityWorldTransformation(e)(n),o=Object(p.a)(Object(p.a)({},r),{},{anchor:{x:r.anchor.x+e.config.width/2,y:e.config.height/2+r.anchor.y}}),a=null===(i=e.canvas)||void 0===i?void 0:i.getContext("2d");if(!a)throw new Error("Cannot get canvas context!");a.save(),a.fillStyle=E.ColorToString(t),a.translate(o.anchor.x,o.anchor.y),a.translate(o.translation.x,o.translation.y),a.rotate(o.rotation);var c=n.properties.size.width*o.scale.x,u=n.properties.size.height*o.scale.y;a.fillRect(-c/2,-u/2,c,u),a.restore()}}}};var m=0,b=function t(){Object(u.a)(this,t)};b.MakeEntity=function(t,e,n,i){return m++,{uuid:String(m),properties:t,components:e,render:n,shaders:i}},b.MakeFolderEntity=function(t){return function(e,n){var i=e.map((function(e){return g.ComputeEntityBoundingBox(t)(e)})),o=i.reduce((function(t,e){return e.minXminY.x<t.minXminY.x?e:t}),i[0]).minXminY.x,a=i.reduce((function(t,e){return e.minXminY.y<t.minXminY.y?e:t}),i[0]).minXminY.y,u=i.reduce((function(t,e){return e.maxXmaxY.x>t.maxXmaxY.x?e:t}),i[0]).maxXmaxY.x,s=i.reduce((function(t,e){return e.maxXmaxY.y>t.maxXmaxY.y?e:t}),i[0]).maxXmaxY.y;m++;var f=!0===n?{x:(o+u)/2,y:(a+s)/2}:{x:0,y:0},d=[o,u,a,s].reduce((function(t,e){return Math.abs(e)>t?e:t}),0);return{uuid:String(m),entities:!0===n?e.map((function(t){return Object(p.a)(Object(p.a)({},t),{},{properties:Object(p.a)(Object(p.a)({},t.properties),{},{position:S.Sub(t.properties.position)(f),anchor:S.Sub(t.properties.position)(f)})})})):e,properties:{position:f,anchor:f,scale:{x:1,y:1},rotation:0,size:!0===n?{width:u-o,height:s-a}:{width:2*d,height:2*d}},components:[{update:function(t,e,n,i){var r=i,o=e;return o.entities=o.entities.map((function(e){var i=e.components.reduce((function(e,i){var r=Object(c.a)(e,2),o=r[0],a=r[1];return i.update(t,o,n,a)}),[e,r]);return r=i[1],i[0]})),[o,r]}}],shaders:[],render:function(t){return function(e){var n=e,i=function(t,e){return e.map((function(e){return Object(p.a)(Object(p.a)({},e),{},{properties:Object(p.a)(Object(p.a)({},e.properties),{},{position:S.Add(e.properties.position)(C.RotatePositionAboutPoint(-t.properties.rotation)(t.properties.anchor)(t.properties.position)),anchor:S.Add(e.properties.anchor)(C.RotatePositionAboutPoint(-t.properties.rotation)(t.properties.anchor)(t.properties.position)),scale:S.Mul(e.properties.scale)(t.properties.scale),rotation:(e.properties.rotation+t.properties.rotation)%(2*Math.PI)})})}))}(n,n.entities).map((function(e){return e.render(t)(e)})).map((function(t,e){return Object(p.a)(Object(p.a)({},t),{},{key:e})}));return r.a.createElement(r.a.Fragment,null,i)}}}}};var g=function t(){Object(u.a)(this,t)};g.GetEntityOrigin=function(t){return function(e){var n;if("center"===t.config.origin)n=e.properties.position;else if("topleft"===t.config.origin)n={x:e.properties.position.x-e.properties.scale.x*e.properties.size.width/2,y:e.properties.position.y+e.properties.scale.y*e.properties.size.height/2};else{if("bottomleft"!==t.config.origin)throw new Error("No such origin location option: "+t.config.origin);n={x:e.properties.position.x-e.properties.scale.x*e.properties.size.width/2,y:e.properties.position.y-e.properties.scale.y*e.properties.size.height/2}}return n}},g.GetEntityBBOrigin=function(t){return function(e){var n,i=g.ComputeEntityBoundingBox(t)(e);if("center"===t.config.origin)n={x:(i.minXminY.x+i.maxXmaxY.x)/2,y:(i.minXminY.y+i.maxXmaxY.y)/2};else if("topleft"===t.config.origin)n=i.minXmaxY;else{if("bottomleft"!==t.config.origin)throw new Error("No such origin location: "+t.config.origin);n=i.minXminY}return n}},g.ComputeEntityBoundingBox=function(t){return function(e){var n=g.GetEntityOrigin(t)(e),i=[{x:e.properties.position.x-e.properties.size.width*e.properties.scale.x/2,y:e.properties.position.y-e.properties.size.height*e.properties.scale.y/2},{x:e.properties.position.x-e.properties.size.width*e.properties.scale.x/2,y:e.properties.position.y+e.properties.size.height*e.properties.scale.y/2},{x:e.properties.position.x+e.properties.size.width*e.properties.scale.x/2,y:e.properties.position.y-e.properties.size.height*e.properties.scale.y/2},{x:e.properties.position.x+e.properties.size.width*e.properties.scale.x/2,y:e.properties.position.y+e.properties.size.height*e.properties.scale.y/2}].map(C.RotatePositionAboutPoint(e.properties.rotation)(n)),r=i.reduce((function(t,e){return e.x<t.x?e:t}),i[0]).x,o=i.reduce((function(t,e){return e.y<t.y?e:t}),i[0]).y,a=i.reduce((function(t,e){return e.x>t.x?e:t}),i[0]).x,c=i.reduce((function(t,e){return e.y>t.y?e:t}),i[0]).y;return{minXminY:{x:r,y:o},minXmaxY:{x:r,y:c},maxXminY:{x:a,y:o},maxXmaxY:{x:a,y:c}}}};var w=function t(){Object(u.a)(this,t)};w.TickActiveScene=function(t){return function(e){var n=t;if(null===n.activeScene)throw new Error("Cannot tick a null active scene!");var i=n.activeScene;return i.entities=i.entities.map((function(t){var r=t.components.reduce((function(t,n){var r=Object(c.a)(t,2),o=r[0],a=r[1];return n.update(e,o,i,a)}),[t,n]);return n=r[1],r[0]})),n.activeScene=i,n.scenes=n.scenes.map((function(t){return t.uuid===i.uuid?i:t})),n}},w.InitEngine=function(t,e){return{scenes:[],activeScene:null,config:null!==t&&void 0!==t?t:{origin:"center",width:window.innerWidth,height:window.innerHeight},canvas:null!==e&&void 0!==e?e:null}};var O=function t(){Object(u.a)(this,t)};O.CreateScene=function(t){return function(e,n){var i={uuid:String(e),entities:[]};return Object(p.a)(Object(p.a)({},t),{},{scenes:t.scenes.concat(i),activeScene:!0===n?i:t.activeScene})}},O.ActivateScene=function(t){return function(e){var n=t.scenes.find((function(t){return t.uuid===e}));if(void 0===n)throw new Error("Couldn't find a scene with sceneID: "+e);return Object(p.a)(Object(p.a)({},t),{},{activeScene:n})}},O.AddEntityToScene=function(t){return function(e){return function(n){var i,r=t.scenes.find((function(t){return t.uuid===e}));if(void 0===r)throw new Error("No scene could be found with sceneID"+e);var o=t,a=null;if(o.scenes=o.scenes.map((function(t){return t.uuid!==(null===r||void 0===r?void 0:r.uuid)?t:a=Object(p.a)(Object(p.a)({},t),{},{entities:t.entities.concat(n)})})),null===a)throw new Error("No scene could be found with sceneID"+e);return Object(p.a)(Object(p.a)({},o),{},{activeScene:r.uuid===(null===(i=o.activeScene)||void 0===i?void 0:i.uuid)?a:o.activeScene})}}},O.RemoveEntityFromScene=function(t){return function(e){return function(n){var i,r=t.scenes.find((function(t){return t.uuid===e}));if(void 0===r)throw new Error("No scene could be found with sceneID"+e);var o=t,a=null;if(o.scenes=o.scenes.map((function(t){return t.uuid!==(null===r||void 0===r?void 0:r.uuid)?t:a=Object(p.a)(Object(p.a)({},r),{},{entities:t.entities.filter((function(t){return t.uuid!==n.uuid}))})})),null===a)throw new Error("No scene could be found with sceneID"+e);return Object(p.a)(Object(p.a)({},o),{},{activeScene:r.uuid===(null===(i=o.activeScene)||void 0===i?void 0:i.uuid)?a:o.activeScene})}}};var j={Camera:f,Entity:b,Game:w,Renderer:v,Scene:O,StyleConversion:y,Animation:s},S=function t(){Object(u.a)(this,t)};S.Add=function(t){return function(e){return{x:t.x+e.x,y:t.y+e.y}}},S.Sub=function(t){return function(e){return{x:t.x-e.x,y:t.y-e.y}}},S.Mul=function(t){return function(e){return{x:t.x*e.x,y:t.y*e.y}}},S.Div=function(t){return function(e){return{x:t.x/e.x,y:t.y/e.y}}},S.Neg=function(t){return{x:-t.x,y:-t.y}};var E=function t(){Object(u.a)(this,t)};E.ColorToString=function(t){return"rgba("+t.r+","+t.g+","+t.b+","+t.a+")"},E.rgbaToColor=function(t,e,n,i){return{r:t,g:e,b:n,a:i}};var C=function t(){Object(u.a)(this,t)};C.RotatePositionAboutPoint=function(t){return function(e){return function(n){var i=Math.cos(t),r=Math.sin(t),o=n.x-e.x,a=n.y-e.y;return{x:i*o+r*a+e.x,y:i*a-r*o+e.y}}}};var z=-1,P=-1,T=0,X=function t(){Object(u.a)(this,t)};X.lastState=void 0;var Y=function(t){var e=Object(c.a)(t,2),n=e[0],i=e[1];X.lastState=n;!function t(){var e=z;Date.now()-P<12.5?z=window.requestAnimationFrame(t):(X.lastState=R([X.lastState,i]),(-1!==z||-1===e)&&(z=window.requestAnimationFrame(t)))}()},A=function(){-1!==z&&(window.cancelAnimationFrame(z),z=-1),P=-1,T=0},R=function(t){var e=Object(c.a)(t,2),n=e[0],i=e[1];X.lastState=n;var r=Date.now(),o=-1===P?1:r-P,a=function(t,e){return!h&&T>120&&(h=!0),(l+=t)>2e4&&A(),e}(o,j.Game.TickActiveScene(X.lastState)(o));return i(a),P=r,T+=1,a},M={height:window.innerHeight,width:window.innerWidth,position:"absolute",top:0,left:0},k=function(){var t=Object(i.useRef)(null);return Object(i.useEffect)((function(){if(null===t.current)throw new Error("Couldn't find canvasRef!");Y([d(t.current),function(t){var e,n,i=null===(e=t.canvas)||void 0===e?void 0:e.getContext("2d");if(!i)throw new Error("Cannot get canvas context!");i.fillStyle="white",i.beginPath(),i.fillRect(0,0,t.config.width,t.config.height),i.stroke(),null===(n=t.activeScene)||void 0===n||n.entities.forEach((function(e){e.render(t)(e)}))}])}),[]),r.a.createElement("canvas",{ref:t,style:M,width:window.innerWidth,height:window.innerHeight})},B=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,14)).then((function(e){var n=e.getCLS,i=e.getFID,r=e.getFCP,o=e.getLCP,a=e.getTTFB;n(t),i(t),r(t),o(t),a(t)}))},I=function(){return r.a.createElement(k,null)};a.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(I,null)),document.getElementById("root")),B()},5:function(t,e,n){},7:function(t,e,n){t.exports=n(13)}},[[7,1,2]]]);
//# sourceMappingURL=main.116576c5.chunk.js.map