jQuery(document).ready(function()
{
  
  jQuery("form[data-remote-extend]").prepend("<div class='message_placeholder'/>")

  jQuery("form[data-remote-extend]").live("ajax:before", function()
  {
    jQuery(".message_placeholder", this).removeClass("success");
    jQuery(".message_placeholder", this).removeClass("error");
    jQuery(".message_placeholder", this).hide();
    
    jQuery(".field_error_message", this).remove();
  })
  
  jQuery("form[data-remote-extend]").live("ajax:success", function()
  {
    jQuery(".message_placeholder", this).html("<p>Success!</p>");
    jQuery(".message_placeholder", this).addClass("success");
    jQuery(".message_placeholder", this).show();
  })
  
  jQuery("form[data-remote-extend]").live("ajax:error", function(xhr, status, error)
  {
    var message_placeholder = jQuery(".message_placeholder", this);
    var error_code = status.status;
    
    if(error_code == 406)
    {
      var errors_for_models = jQuery.parseJSON(status.responseText);
      var messages = "";
      
      jQuery.each(errors_for_models, function(model, errors)
      {
        jQuery.each(errors, function(property, error_messages)
        { 
            var field_id = "#" + model.replace("/", "_") + "_" + property;
            var field = jQuery(field_id);
            
            field.addClass('in_error');

            if(property == 'base')
            {
              messages += "<p>" + error_messages + "</p>"; // need to split the array
            }
            else
            {
              jQuery.each(error_messages, function(i, message)
              {
                jQuery(field).after("<div class='field_error_message'>" + property + " " + message + "</div>");
              })
            }
        })
      })
      
      if(messages)
      {
        message_placeholder.html(messages);
        message_placeholder.addClass('error')
        message_placeholder.show();
      }
    }
    else
    {
      message_placeholder.html("<p>Something went wrong.</p>")
      message_placeholder.addClass('error')
      message_placeholder.show();
    }
    
  })  
  
  
  
  
})