public class ClasseContatore implements Runnable{
    @Override
    public void run() {
        for (int i = 0; i < 10000; i++) {
            if (Thread.currentThread().isInterrupted()) break;
            System.out.println(Thread.currentThread().getName() + " : " + i);
        }
    }
}
