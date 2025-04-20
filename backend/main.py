from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.lostAndFound import router as lostAndFound
from routers.path import router as pathfinder_router
from routers.procedure import router as procedure



# Create FastAPI instance
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify your frontend's URL instead of "*"
    allow_credentials=True,
    allow_methods=["*"],  # Or ["POST", "GET", "OPTIONS"]
    allow_headers=["*"],
)


# Include the router with the desired prefix and tags
app.include_router(lostAndFound, prefix="/lostAndFound", tags=["lost and found"])
app.include_router(pathfinder_router, tags=["lost and found"])
app.include_router(procedure, tags=["procedure"])



# This will serve as the main entry point
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
