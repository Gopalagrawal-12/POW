// Alternating Add and Subtract (Curried
// Function)
//approach : first create a constructor then create a function that takes multiple apply() as parameters then by switching a boolean each time
// time complexity : O(n)
// space complexity : O(1)
public class AlternatingSum {
    private final int v;
    private final boolean add;

    public AlternatingSum(int v, boolean add) {
        this.v = v;
        this.add = add;
    }
    public Function<Integer, AlternatingSum> apply() {
        return (Integer x) -> {
            if (addNext) {
                return new AlternatingSum(value + x, false);
            } else {
                return new AlternatingSum(value - x, true);
            }
        };
    }
    public static AlternatingSum add_subtract(int num) {
        return new AlternatingSum(num, false);
    }
    
    public static void main(String[] args) {
        System.out.println(add_subtract(7)); 
        System.out.println(add_subtract(1).apply().apply(2).apply(3)); 
        System.out.println(add_subtract(-5).apply().apply(10).apply(3).apply(9));
    }
}
