from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import db
from routes.auth import auth_bp
from routes.inventory import inventory_bp
from routes.forecast import forecast_bp
from routes.crm import crm_bp
from routes.sales import sales_bp
from routes.purchase import purchase_bp
from routes.accounting import accounting_bp
from routes.hr import hr_bp
from routes.projects import projects_bp
from routes.assets import assets_bp
from routes.inventory_extended import inventory_ext_bp
from routes.export import export_bp
from routes.notifications import notifications_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
    app.register_blueprint(forecast_bp, url_prefix='/api/forecast')
    app.register_blueprint(crm_bp, url_prefix='/api')
    app.register_blueprint(sales_bp, url_prefix='/api')
    app.register_blueprint(purchase_bp, url_prefix='/api')
    app.register_blueprint(accounting_bp, url_prefix='/api')
    app.register_blueprint(hr_bp, url_prefix='/api')
    app.register_blueprint(projects_bp, url_prefix='/api')
    app.register_blueprint(assets_bp, url_prefix='/api')
    app.register_blueprint(inventory_ext_bp, url_prefix='/api')
    app.register_blueprint(export_bp, url_prefix='/api/export')
    app.register_blueprint(notifications_bp, url_prefix='/api')

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "ok", "message": "Synergybeam ERP API is running"})

    # Global error handler
    @app.errorhandler(Exception)
    def handle_exception(e):
        return jsonify({"error": str(e)}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
