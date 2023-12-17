var = 100

def outer():

    var = "python"

    print(var)

   

    def inner1():

        nonlocal var

        var = "programming"

       

        def inner2():

            global var

            var = "MEK3100"

           

        print("inner(before)", var)

        inner2()

        print("inner(after)", var)

       

    inner1()

    print("outer", var)

 

outer()

print(var)