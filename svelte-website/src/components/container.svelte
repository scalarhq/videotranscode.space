<script>
  export let title = 'Add a file'
</script>
 

<div class="container">
    <h1 class="container-title">{title}</h1>
    <div class="container-content">
        <slot></slot>
    </div>

    <i class="fas fa-chevron-circle-down next-icon"></i>
</div>

<style>
h1.container-title {
    font-size: 27px;
    text-align: left;
    color: #959CB4;
    font-weight: 400;
}

.next-icon {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>