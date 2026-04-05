
export function LoadingWrap() { 

    return (

        <div className="loading-wrap">
        
         <style>{`
            .loader {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: inline-block;
            border-top: 3px solid #FFF;
            border-right: 3px solid transparent;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
            }

            @keyframes rotation {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
            } 
         `}</style>
        <span className="loader"></span><br></br>
        <span>Loading...</span>
        </div>
        
    ); 
}