'use client'

import { useState, useEffect } from 'react'

export default function Header({ theme, updateTheme }) {
	return (
		<header className="h-10 py-2 px-30" data-theme={theme}>
	      <input type="checkbox" checked={theme && theme != 'light' ? true : false} className="float-right toggle" onClick={updateTheme} onChange={() => {}}  />
	    </header>
	);
}