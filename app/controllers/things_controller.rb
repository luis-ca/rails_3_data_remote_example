class ThingsController < ApplicationController
  
  def index
    redirect_to new_thing_path
  end
  
  def new
  end
  
  def create
    begin
      raise Error if params[:thing][:name] == 'error'
      @thing = Thing.create!(params[:thing])
      render :json => {}, :status => 200
    rescue ActiveRecord::RecordInvalid => e
      render :json => collect_errors_for(e.record), :status => 406
    rescue
      render :json => {}, :status => 500
    end
  end
  
  def collect_errors_for(*args)
    errors = {}
    args.each do |model|
      if model and model.respond_to?(:error_namespace)
        namespace = model.error_namespace.to_sym
      else
        namespace = model.class.name.underscore.to_sym
      end
      errors[namespace] = model.errors if model and model.errors
      errors[namespace][:base] = ["Oooops! Something is not right."] unless errors[namespace][:base].present?
    end
    
    errors
  end
  
end