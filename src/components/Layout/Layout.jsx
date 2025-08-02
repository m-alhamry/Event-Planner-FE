import Header from "./Header";

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <main className="main-content">
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
}