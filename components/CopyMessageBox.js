'use client';
export default function CopyMessageBox({customerName,total,orderUrl}){
 const message=`Hi ${customerName || 'there'}! 🌸\n\nThank you for shopping with Erendira's Boutique!\n\nYour private order page is ready.\n\nView your order here:\n${orderUrl}\n\nTotal: $${Number(total||0).toFixed(2)}\n\nThank you! 💜`;
 async function copyText(text){await navigator.clipboard.writeText(text); alert('Copied!')}
 return <div className="messageBox"><p className="eyebrow">Message ready</p><pre>{message}</pre><div className="actions"><button className="btn primary" onClick={()=>copyText(message)}>Copy Message</button><button className="btn purple" onClick={()=>copyText(orderUrl)}>Copy Link</button><a className="btn outline" href="https://www.messenger.com" target="_blank">Open Messenger</a></div></div>
}
