const PageLoader = () => {

  return (
    <div>
      <div>
        <div
          className="z-50 backdrop-blur-md backdrop-saturate-150 bg-overlay/70 w-screen h-screen fixed inset-0"
          aria-hidden="true"
          style={{ opacity: 1 }}
        />
        <div
          className="flex flex-col w-screen h-[100dvh] fixed inset-0 z-50 overflow-x-auto justify-center [--scale-enter:100%] [--scale-exit:100%] [--slide-enter:0px] [--slide-exit:80px] sm:[--scale-enter:100%] sm:[--scale-exit:103%] sm:[--slide-enter:0px] sm:[--slide-exit:0px] items-center"
          style={{ opacity: 1, transform: 'translateY(0px) scale(1) translateZ(0px)' }}
        >
          <lord-icon
            src="https://cdn.lordicon.com/ofzpbawy.json"
            trigger="loop"
            delay="1000"
            colors="primary:#000000,secondary:#ef8535,tertiary:#ae5630,quaternary:#ae5630"
            style={{ width: '80px', height: '80px' }}
          />

          <div className="text-center text-xs mt-4">Cargando...</div>
        </div>
      </div>
    </div>
  );
}
export default PageLoader;