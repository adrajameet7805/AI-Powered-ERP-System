from flask import Blueprint
from routes.crud import create_crud_routes
from models.projects import Project, Task

projects_bp = Blueprint('projects', __name__)

create_crud_routes(projects_bp, Project, 'projects')
create_crud_routes(projects_bp, Task, 'tasks')
