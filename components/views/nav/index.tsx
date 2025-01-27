import React, { useEffect } from "react";

export default function Nav() {
    useEffect(() => {
        const dragover = () => {
            console.log('dragover');
        };
        const dragend = () => {
            console.log('dragend');
        };
        const drop = () => {
            console.log('drop');
        };
        const mousedown = () => {
            console.log('mousedown');
        };
        const mousemove = () => {
            console.log('mousemove');
        };
        const mouseup = () => {
            console.log('mouseup')
        };
        // document.addEventListener('dragover', dragover);
        // document.addEventListener('dragend', dragend);
        // document.addEventListener('drop', drop);
        document.addEventListener('mousedown', mousedown);
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        return () => {
            document.removeEventListener('dragover', dragover);
            document.removeEventListener('dragend', dragend);
            document.removeEventListener('drop', drop);
            document.removeEventListener('mousedown', mousedown);
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
        };
    }, []);
    return <>
        <div>nav</div>
    </>
}
