'use client';
export default function SignOutButton(){async function out(){await fetch('/api/auth/logout',{method:'POST'});window.location.href='/login'}return <button className="logout" onClick={out}>Sign out</button>}
