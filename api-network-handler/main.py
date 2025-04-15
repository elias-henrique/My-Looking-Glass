from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ip_router, whois_router, network_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers for modular endpoints
app.include_router(ip_router, prefix="/ip", tags=["IP Utilities"])
app.include_router(whois_router, prefix="/whois", tags=["Whois"])
app.include_router(network_router, prefix="/network", tags=["Network Utilities"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

# telnet://201.48.0.2