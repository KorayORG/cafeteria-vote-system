export function playSuccess(enabled=true){
  if(!enabled) return;
  const a = new Audio('/sounds/success.mp3');
  a.volume = 0.25; a.play().catch(()=>{});
}
export function playError(enabled=true){
  if(!enabled) return;
  const a = new Audio('/sounds/error.mp3');
  a.volume = 0.25; a.play().catch(()=>{});
}
