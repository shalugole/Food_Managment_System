$(document).ready(function(){

    $.getJSON('/foods/fetch_all_foods',function(data){
        data.map((item) => {
            $('#type').append($('<option>').text(item.foodname).val(item.foodid))
            console.log(data)
        })
       
    })
    $('#type').change(function(){
        $.getJSON('/foods/fetch_all_fooditem',{foodid:$('#type').val()},function(data){
            $('#fooditem').empty()
            $('#fooditem').append($('<option>').text('-Select FoodItem-'))
            console.log(data)
            data.map((it)=>{
                $('#fooditem').append($('<option>').text(it.fooditemname).val(it.fooditemid))
            })
        })
    })
})
