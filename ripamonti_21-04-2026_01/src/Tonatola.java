public class Tonatola implements Runnable{

    @Override
    public void run() {
        String s = "tonatola";
        for (int j = 0; j < 1000; j++) {
            System.out.println(Thread.currentThread().getName() + " " + j);
//            System.out.println("id tonatola: " + Thread.currentThread().getId());
//            for (int i = 0; i < s.length(); i++) {
//                System.out.println(s.charAt(i));
//            }
        }
    }
}
